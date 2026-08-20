import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearRateLimits, rateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    clearRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearRateLimits();
  });

  it("allows requests under the limit", () => {
    const first = rateLimit("contact:127.0.0.1", { limit: 5, windowMs: 60_000 });
    const second = rateLimit("contact:127.0.0.1", { limit: 5, windowMs: 60_000 });

    expect(first.success).toBe(true);
    expect(first.remaining).toBe(4);
    expect(second.success).toBe(true);
    expect(second.remaining).toBe(3);
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = "contact:192.0.2.1";
    const options = { limit: 3, windowMs: 60_000 };

    rateLimit(key, options);
    rateLimit(key, options);
    rateLimit(key, options);
    const blocked = rateLimit(key, options);

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets the counter after the window expires", () => {
    const key = "newsletter:10.0.0.1";
    const options = { limit: 2, windowMs: 60_000 };

    rateLimit(key, options);
    rateLimit(key, options);
    expect(rateLimit(key, options).success).toBe(false);

    vi.advanceTimersByTime(60_001);

    const afterReset = rateLimit(key, options);
    expect(afterReset.success).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });

  it("tracks keys independently", () => {
    const options = { limit: 2, windowMs: 60_000 };

    rateLimit("a", options);
    rateLimit("a", options);
    expect(rateLimit("a", options).success).toBe(false);

    expect(rateLimit("b", options).success).toBe(true);
  });

  it("supports manual reset via resetRateLimit", () => {
    const key = "api:test";
    rateLimit(key, { limit: 1, windowMs: 60_000 });
    expect(rateLimit(key, { limit: 1, windowMs: 60_000 }).success).toBe(false);

    resetRateLimit(key);

    expect(rateLimit(key, { limit: 1, windowMs: 60_000 }).success).toBe(true);
  });

  it("uses default limit and window when options are omitted", () => {
    const result = rateLimit("default-key");
    expect(result.limit).toBe(10);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
  });
});
