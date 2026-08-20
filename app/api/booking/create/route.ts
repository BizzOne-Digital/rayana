import type { NextRequest } from "next/server";
import {
  getClientIp,
  jsonCreated,
  jsonError,
  parseJsonBody,
  serializeDoc,
  withPublicHandler,
} from "@/lib/api/utils";
import { BookingError, createBookingHold } from "@/lib/booking/service";
import { rateLimit } from "@/lib/rate-limit";
import { expireStaleHolds } from "@/lib/booking/slots";
import { bookingCreateSchema } from "@/lib/validation/common";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const ip = getClientIp(request) ?? "unknown";
    const limited = rateLimit(`booking-create:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!limited.success) {
      return jsonError("Too many booking attempts. Please try again later.", 429);
    }

    const parsed = await parseJsonBody(request, bookingCreateSchema);
    if (!parsed.success) return parsed.response;

    await expireStaleHolds();

    try {
      const booking = await createBookingHold(parsed.data);
      return jsonCreated({
        booking: serializeDoc(booking),
        referenceNumber: booking.referenceNumber,
        holdExpiresAt: booking.holdExpiresAt,
        rescheduleToken: booking.rescheduleToken,
      });
    } catch (error) {
      if (error instanceof BookingError) {
        const status =
          error.code === "SLOT_UNAVAILABLE"
            ? 409
            : error.code === "SERVICE_NOT_FOUND"
              ? 404
              : 400;
        return jsonError(error.message, status, { code: error.code });
      }
      throw error;
    }
  });
}
