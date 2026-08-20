import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  endOfDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import {
  AvailabilityRule,
  BlackoutDate,
  Booking,
  type IAvailabilityRule,
  type IBlackoutDate,
} from "@/models";
import { DEFAULT_TIMEZONE } from "@/lib/constants";

export type TimeSlot = {
  startUtc: Date;
  endUtc: Date;
  startLocal: string;
  endLocal: string;
  slotKey: string;
};

export type AvailabilityQuery = {
  serviceSlug: string;
  clientTimeZone: string;
  hostTimeZone?: string;
  from: Date;
  to: Date;
  durationMinutes: number;
  slotIntervalMinutes?: number;
};

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function isBlackoutAt(
  date: Date,
  blackout: IBlackoutDate,
  hostTimeZone: string,
): boolean {
  if (!blackout.active) return false;

  const dayStart = startOfDay(toZonedTime(date, hostTimeZone));
  const blackoutStart = startOfDay(toZonedTime(blackout.startDate, hostTimeZone));
  const blackoutEnd = endOfDay(toZonedTime(blackout.endDate, hostTimeZone));

  if (dayStart < blackoutStart || dayStart > blackoutEnd) {
    return false;
  }

  if (blackout.allDay) {
    return true;
  }

  const localTime = formatInTimeZone(date, hostTimeZone, "HH:mm");
  const minutes = parseTimeToMinutes(localTime);
  const start = blackout.startTime ? parseTimeToMinutes(blackout.startTime) : 0;
  const end = blackout.endTime ? parseTimeToMinutes(blackout.endTime) : 24 * 60;
  return minutes >= start && minutes < end;
}

function overlapsExisting(
  startUtc: Date,
  endUtc: Date,
  bookings: Array<{ startUtc: Date; endUtc: Date }>,
): boolean {
  return bookings.some(
    (booking) => startUtc < booking.endUtc && endUtc > booking.startUtc,
  );
}

function buildSlotKey(serviceSlug: string, startUtc: Date): string {
  return `${serviceSlug}:${startUtc.toISOString()}`;
}

export async function getAvailableSlots(
  query: AvailabilityQuery,
): Promise<TimeSlot[]> {
  const hostTimeZone = query.hostTimeZone ?? DEFAULT_TIMEZONE;
  const slotInterval = query.slotIntervalMinutes ?? query.durationMinutes;
  const now = new Date();

  const [rules, blackouts, bookings] = await Promise.all([
    AvailabilityRule.find({ active: true }).lean<IAvailabilityRule[]>(),
    BlackoutDate.find({ active: true }).lean<IBlackoutDate[]>(),
    Booking.find({
      serviceSlug: query.serviceSlug,
      status: { $in: ["hold", "pending_payment", "confirmed"] },
      startUtc: { $gte: query.from, $lte: query.to },
      $or: [
        { holdExpiresAt: { $exists: false } },
        { holdExpiresAt: { $gt: now } },
      ],
    })
      .select("startUtc endUtc")
      .lean(),
  ]);

  const days = eachDayOfInterval({
    start: startOfDay(query.from),
    end: startOfDay(query.to),
  });

  const slots: TimeSlot[] = [];

  for (const day of days) {
    const zonedDay = toZonedTime(day, hostTimeZone);
    const dayOfWeek = zonedDay.getDay();

    const dayRules = rules.filter((rule) => rule.dayOfWeek === dayOfWeek);
    if (dayRules.length === 0) continue;

    for (const rule of dayRules) {
      const startMinutes = parseTimeToMinutes(rule.startTime);
      const endMinutes = parseTimeToMinutes(rule.endTime);

      for (
        let cursor = startMinutes;
        cursor + query.durationMinutes <= endMinutes;
        cursor += slotInterval
      ) {
        const startLocalTime = minutesToTime(cursor);
        const endLocalTime = minutesToTime(cursor + query.durationMinutes);
        const localDate = formatInTimeZone(day, hostTimeZone, "yyyy-MM-dd");

        const startUtc = fromZonedTime(
          `${localDate}T${startLocalTime}:00`,
          hostTimeZone,
        );
        const endUtc = fromZonedTime(
          `${localDate}T${endLocalTime}:00`,
          hostTimeZone,
        );

        if (isBefore(startUtc, now)) continue;
        if (startUtc < query.from || startUtc > query.to) continue;

        if (blackouts.some((blackout) => isBlackoutAt(startUtc, blackout, hostTimeZone))) {
          continue;
        }

        if (overlapsExisting(startUtc, endUtc, bookings)) {
          continue;
        }

        slots.push({
          startUtc,
          endUtc,
          startLocal: formatInTimeZone(
            startUtc,
            query.clientTimeZone,
            "yyyy-MM-dd'T'HH:mm:ssXXX",
          ),
          endLocal: formatInTimeZone(
            endUtc,
            query.clientTimeZone,
            "yyyy-MM-dd'T'HH:mm:ssXXX",
          ),
          slotKey: buildSlotKey(query.serviceSlug, startUtc),
        });
      }
    }
  }

  return slots.sort((a, b) => a.startUtc.getTime() - b.startUtc.getTime());
}

export function parseServiceDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? Number(match[1]) : 60;
}

export function defaultAvailabilityRange(days = 42): { from: Date; to: Date } {
  const from = startOfDay(new Date());
  const to = endOfDay(addDays(from, days));
  return { from, to };
}

export async function expireStaleHolds(): Promise<number> {
  const now = new Date();
  const result = await Booking.updateMany(
    {
      status: "hold",
      holdExpiresAt: { $lte: now },
    },
    {
      $set: {
        status: "cancelled",
        cancelledAt: now,
        cancellationReason: "Hold expired",
      },
    },
  );

  return result.modifiedCount ?? 0;
}

export function addHoldExpiry(minutes: number): Date {
  return addMinutes(new Date(), minutes);
}
