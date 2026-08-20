import { describe, expect, it } from "vitest";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import {
  defaultAvailabilityRange,
  parseServiceDurationMinutes,
} from "@/lib/booking/slots";
import { DEFAULT_TIMEZONE } from "@/lib/constants";

const HOST_TZ = DEFAULT_TIMEZONE;

function slotStartUtc(localDate: string, localTime: string): Date {
  return fromZonedTime(`${localDate}T${localTime}:00`, HOST_TZ);
}

function slotEndUtc(localDate: string, localTime: string): Date {
  return fromZonedTime(`${localDate}T${localTime}:00`, HOST_TZ);
}

describe("booking slot timezone conversion", () => {
  it("converts a standard weekday slot from Vancouver local time to UTC", () => {
    const startUtc = slotStartUtc("2026-01-15", "09:00");
    const endUtc = slotEndUtc("2026-01-15", "10:00");

    expect(formatInTimeZone(startUtc, HOST_TZ, "HH:mm")).toBe("09:00");
    expect(formatInTimeZone(endUtc, HOST_TZ, "HH:mm")).toBe("10:00");
    expect(endUtc.getTime() - startUtc.getTime()).toBe(60 * 60 * 1000);
  });

  it("handles spring-forward DST boundary (America/Vancouver, March 2026)", () => {
    // 2026-03-08: clocks jump 02:00 → 03:00. Morning slots remain stable.
    const beforeDst = slotStartUtc("2026-03-07", "09:00");
    const afterDst = slotStartUtc("2026-03-09", "09:00");

    expect(formatInTimeZone(beforeDst, HOST_TZ, "yyyy-MM-dd HH:mm")).toBe(
      "2026-03-07 09:00",
    );
    expect(formatInTimeZone(afterDst, HOST_TZ, "yyyy-MM-dd HH:mm")).toBe(
      "2026-03-09 09:00",
    );

    // UTC offset shifts from -08:00 (PST) to -07:00 (PDT) across the transition.
    expect(formatInTimeZone(beforeDst, HOST_TZ, "XXX")).toBe("-08:00");
    expect(formatInTimeZone(afterDst, HOST_TZ, "XXX")).toBe("-07:00");
  });

  it("handles fall-back DST boundary (America/Vancouver, November 2026)", () => {
    const beforeFallback = slotStartUtc("2026-10-31", "09:00");
    const afterFallback = slotStartUtc("2026-11-02", "09:00");

    expect(formatInTimeZone(beforeFallback, HOST_TZ, "XXX")).toBe("-07:00");
    expect(formatInTimeZone(afterFallback, HOST_TZ, "XXX")).toBe("-08:00");
    expect(formatInTimeZone(afterFallback, HOST_TZ, "HH:mm")).toBe("09:00");
  });

  it("formats client-facing local times independently of host timezone", () => {
    const startUtc = slotStartUtc("2026-06-15", "09:00");
    const clientTz = "America/Toronto";

    const clientLocal = formatInTimeZone(
      startUtc,
      clientTz,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    );

    expect(clientLocal).toMatch(/^2026-06-15T\d{2}:00:00[+-]\d{2}:\d{2}$/);
    expect(formatInTimeZone(startUtc, HOST_TZ, "HH:mm")).toBe("09:00");
  });

  it("maps the same UTC instant to different wall-clock labels across zones", () => {
    const startUtc = slotStartUtc("2026-06-15", "09:00");
    const vancouver = formatInTimeZone(startUtc, HOST_TZ, "HH:mm");
    const utc = formatInTimeZone(startUtc, "UTC", "HH:mm");

    expect(vancouver).toBe("09:00");
    expect(utc).not.toBe(vancouver);
  });

  it("preserves day-of-week in host timezone when iterating days", () => {
    const day = new Date("2026-03-09T12:00:00.000Z");
    const zonedDay = toZonedTime(day, HOST_TZ);
    expect(zonedDay.getDay()).toBe(1); // Monday
  });
});

describe("booking slot helpers", () => {
  it("parses duration strings", () => {
    expect(parseServiceDurationMinutes("60 minutes")).toBe(60);
    expect(parseServiceDurationMinutes("Programme-based")).toBe(60);
    expect(parseServiceDurationMinutes("90")).toBe(90);
  });

  it("returns a default availability window", () => {
    const { from, to } = defaultAvailabilityRange(7);
    expect(from.getTime()).toBeLessThan(to.getTime());
    expect(to.getTime() - from.getTime()).toBeGreaterThan(6 * 24 * 60 * 60 * 1000);
  });
});
