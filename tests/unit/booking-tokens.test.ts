import { createHmac } from "crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createRescheduleToken,
  verifyRescheduleToken,
} from "@/lib/booking/tokens";
import { RESCHEDULE_NOTICE_HOURS } from "@/lib/constants";

const TEST_SECRET = "test-secret-for-booking-tokens-min-32-chars";

function canRescheduleByNotice(
  startUtc: Date,
  noticeHours = RESCHEDULE_NOTICE_HOURS,
  now = new Date(),
): boolean {
  const noticeMs = noticeHours * 60 * 60 * 1000;
  return startUtc.getTime() - now.getTime() >= noticeMs;
}

describe("reschedule token verification", () => {
  beforeEach(() => {
    vi.stubEnv("AUTH_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates and verifies a valid token", () => {
    const bookingId = "507f1f77bcf86cd799439011";
    const { token, expiresAt } = createRescheduleToken(bookingId);

    const result = verifyRescheduleToken(token);

    expect(result.valid).toBe(true);
    expect(result.bookingId).toBe(bookingId);
    expect(result.expiresAt?.getTime()).toBe(expiresAt.getTime());
  });

  it("rejects a malformed token", () => {
    const result = verifyRescheduleToken("not-a-valid-token");
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Malformed token");
  });

  it("rejects a token with an invalid signature", () => {
    const bookingId = "507f1f77bcf86cd799439011";
    const { token } = createRescheduleToken(bookingId);
    const parts = token.split(":");
    const tampered = `${parts[0]}:${parts[1]}:${"0".repeat(64)}`;

    const result = verifyRescheduleToken(tampered);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Invalid token signature");
  });

  it("rejects an expired token", () => {
    const bookingId = "507f1f77bcf86cd799439011";
    const expiredAt = new Date(Date.now() - 60_000);
    const { token } = createRescheduleToken(bookingId, expiredAt);

    const result = verifyRescheduleToken(token);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Token expired");
  });

  it("rejects a token with invalid expiry timestamp", () => {
    const payload = `${"507f1f77bcf86cd799439011"}:not-a-number`;
    const signature = createHmac("sha256", TEST_SECRET)
      .update(payload)
      .digest("hex");
    const result = verifyRescheduleToken(`${payload}:${signature}`);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Invalid token expiry");
  });
});

describe("24-hour reschedule notice rule", () => {
  it("allows rescheduling when the session is more than 24 hours away", () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    const startUtc = new Date("2026-06-03T12:00:00.000Z");

    expect(canRescheduleByNotice(startUtc, 24, now)).toBe(true);
  });

  it("blocks rescheduling inside the 24-hour notice window", () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    const startUtc = new Date("2026-06-02T11:00:00.000Z");

    expect(canRescheduleByNotice(startUtc, 24, now)).toBe(false);
  });

  it("allows rescheduling exactly at the 24-hour boundary", () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    const startUtc = new Date("2026-06-02T12:00:00.000Z");

    expect(canRescheduleByNotice(startUtc, 24, now)).toBe(true);
  });

  it("uses RESCHEDULE_NOTICE_HOURS constant (24) by default", () => {
    expect(RESCHEDULE_NOTICE_HOURS).toBe(24);
  });
});
