import { formatInTimeZone } from "date-fns-tz";
import {
  Booking,
  buildBookingSlotKey,
  Service,
  type IBooking,
  type IService,
} from "@/models";
import {
  BOOKING_HOLD_MINUTES,
  DEFAULT_CURRENCY,
  DEFAULT_TIMEZONE,
  RESCHEDULE_NOTICE_HOURS,
} from "@/lib/constants";
import type { BookingCreateInput } from "@/lib/validation/common";
import { getSiteSettings } from "@/lib/repositories/settings";
import { addHoldExpiry, parseServiceDurationMinutes } from "@/lib/booking/slots";
import { createRescheduleToken } from "@/lib/booking/tokens";

export class BookingError extends Error {
  constructor(
    message: string,
    public code:
      | "SERVICE_NOT_FOUND"
      | "SERVICE_NOT_BOOKABLE"
      | "SLOT_UNAVAILABLE"
      | "BOOKING_NOT_FOUND"
      | "INVALID_STATUS"
      | "RESCHEDULE_TOO_LATE"
      | "VALIDATION",
  ) {
    super(message);
    this.name = "BookingError";
  }
}

function generateReferenceNumber(): string {
  const stamp = formatInTimeZone(new Date(), DEFAULT_TIMEZONE, "yyyyMMdd");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `HM-${stamp}-${suffix}`;
}

function resolveServicePrice(service: IService): number {
  if (service.specialOfferActive && service.specialPrice != null) {
    return service.specialPrice;
  }
  return service.standardPrice ?? 0;
}

export async function createBookingHold(
  input: BookingCreateInput,
): Promise<IBooking> {
  const service = await Service.findOne({
    slug: input.serviceSlug,
    status: "active",
    bookable: true,
  });

  if (!service) {
    throw new BookingError("Service not found or not bookable", "SERVICE_NOT_FOUND");
  }

  const settings = await getSiteSettings();
  const hostTimeZone = settings?.booking.hostTimeZone ?? DEFAULT_TIMEZONE;
  const holdMinutes =
    settings?.booking.holdDurationMinutes ?? BOOKING_HOLD_MINUTES;
  const durationMinutes = parseServiceDurationMinutes(service.duration);

  if (
    input.endUtc.getTime() - input.startUtc.getTime() !==
    durationMinutes * 60 * 1000
  ) {
    throw new BookingError("Invalid slot duration", "VALIDATION");
  }

  const slotKey = buildBookingSlotKey(input.serviceSlug, input.startUtc);
  const conflicting = await Booking.findOne({
    slotKey,
    status: { $in: ["hold", "pending_payment", "confirmed"] },
    $or: [
      { holdExpiresAt: { $exists: false } },
      { holdExpiresAt: { $gt: new Date() } },
    ],
  });

  if (conflicting) {
    throw new BookingError("Selected time is no longer available", "SLOT_UNAVAILABLE");
  }

  const amount = resolveServicePrice(service);
  const currency = settings?.payments.defaultCurrency ?? DEFAULT_CURRENCY;
  const holdExpiresAt = addHoldExpiry(holdMinutes);
  const referenceNumber = generateReferenceNumber();
  const { token, expiresAt } = createRescheduleToken("pending");

  const booking = await Booking.create({
    referenceNumber,
    serviceSlug: service.slug,
    serviceId: service._id,
    serviceTitle: service.title,
    deliveryMode: input.deliveryMode,
    clientTimeZone: input.clientTimeZone,
    hostTimeZone,
    startUtc: input.startUtc,
    endUtc: input.endUtc,
    startLocal: formatInTimeZone(
      input.startUtc,
      input.clientTimeZone,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    ),
    endLocal: formatInTimeZone(
      input.endUtc,
      input.clientTimeZone,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    ),
    durationMinutes,
    slotKey,
    client: input.client,
    payment: {
      method: input.paymentMethod,
      status: "pending",
      amount,
      currency,
    },
    status: "hold",
    holdExpiresAt,
    rescheduleToken: token,
    rescheduleTokenExpiresAt: expiresAt,
  });

  const issued = createRescheduleToken(String(booking._id));
  booking.rescheduleToken = issued.token;
  booking.rescheduleTokenExpiresAt = issued.expiresAt;
  await booking.save();

  return booking;
}

export async function confirmBooking(
  referenceNumber: string,
  paymentMethod?: "stripe" | "e_transfer",
): Promise<IBooking> {
  const booking = await Booking.findOne({ referenceNumber });
  if (!booking) {
    throw new BookingError("Booking not found", "BOOKING_NOT_FOUND");
  }

  if (!["hold", "pending_payment"].includes(booking.status)) {
    throw new BookingError("Booking cannot be confirmed", "INVALID_STATUS");
  }

  if (booking.holdExpiresAt && booking.holdExpiresAt <= new Date()) {
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancellationReason = "Hold expired";
    await booking.save();
    throw new BookingError("Booking hold has expired", "INVALID_STATUS");
  }

  if (paymentMethod) {
    booking.payment.method = paymentMethod;
  }

  booking.status =
    booking.payment.method === "e_transfer" ? "pending_payment" : "confirmed";
  booking.confirmedAt = new Date();
  booking.holdExpiresAt = undefined;

  if (booking.payment.method === "e_transfer") {
    booking.payment.status = "pending";
  } else {
    booking.payment.status = "paid";
    booking.payment.paidAt = new Date();
  }

  await booking.save();
  return booking;
}

export async function rescheduleBooking(input: {
  token: string;
  startUtc: Date;
  endUtc: Date;
  clientTimeZone: string;
}): Promise<IBooking> {
  const { verifyRescheduleToken } = await import("@/lib/booking/tokens");
  const verified = verifyRescheduleToken(input.token);

  if (!verified.valid || !verified.bookingId) {
    throw new BookingError(verified.reason ?? "Invalid token", "VALIDATION");
  }

  const booking = await Booking.findById(verified.bookingId);
  if (!booking) {
    throw new BookingError("Booking not found", "BOOKING_NOT_FOUND");
  }

  if (!["confirmed", "pending_payment"].includes(booking.status)) {
    throw new BookingError("Booking cannot be rescheduled", "INVALID_STATUS");
  }

  const settings = await getSiteSettings();
  const noticeHours =
    settings?.booking.rescheduleNoticeHours ?? RESCHEDULE_NOTICE_HOURS;
  const noticeMs = noticeHours * 60 * 60 * 1000;

  if (booking.startUtc.getTime() - Date.now() < noticeMs) {
    throw new BookingError(
      `Rescheduling requires at least ${noticeHours} hours notice`,
      "RESCHEDULE_TOO_LATE",
    );
  }

  const slotKey = buildBookingSlotKey(booking.serviceSlug, input.startUtc);
  const conflicting = await Booking.findOne({
    _id: { $ne: booking._id },
    slotKey,
    status: { $in: ["hold", "pending_payment", "confirmed"] },
    $or: [
      { holdExpiresAt: { $exists: false } },
      { holdExpiresAt: { $gt: new Date() } },
    ],
  });

  if (conflicting) {
    throw new BookingError("Selected time is no longer available", "SLOT_UNAVAILABLE");
  }

  booking.startUtc = input.startUtc;
  booking.endUtc = input.endUtc;
  booking.startLocal = formatInTimeZone(
    input.startUtc,
    input.clientTimeZone,
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  );
  booking.endLocal = formatInTimeZone(
    input.endUtc,
    input.clientTimeZone,
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  );
  booking.clientTimeZone = input.clientTimeZone;
  booking.slotKey = slotKey;
  booking.status = "confirmed";

  const issued = createRescheduleToken(String(booking._id));
  booking.rescheduleToken = issued.token;
  booking.rescheduleTokenExpiresAt = issued.expiresAt;

  await booking.save();
  return booking;
}

export async function cancelBooking(input: {
  referenceNumber?: string;
  token?: string;
  reason?: string;
}): Promise<IBooking> {
  let booking: IBooking | null = null;

  if (input.token) {
    const { verifyRescheduleToken } = await import("@/lib/booking/tokens");
    const verified = verifyRescheduleToken(input.token);
    if (!verified.valid || !verified.bookingId) {
      throw new BookingError(verified.reason ?? "Invalid token", "VALIDATION");
    }
    booking = await Booking.findById(verified.bookingId);
  } else if (input.referenceNumber) {
    booking = await Booking.findOne({ referenceNumber: input.referenceNumber });
  }

  if (!booking) {
    throw new BookingError("Booking not found", "BOOKING_NOT_FOUND");
  }

  if (["cancelled", "completed"].includes(booking.status)) {
    throw new BookingError("Booking is already closed", "INVALID_STATUS");
  }

  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancellationReason = input.reason ?? "Cancelled by client";
  booking.payment.status = "cancelled";
  await booking.save();

  return booking;
}

export { resolveServicePrice, generateReferenceNumber };
