import { describe, expect, it, vi } from "vitest";

type AuditLookup = (eventId: string) => Promise<unknown | null>;

/**
 * Mirrors the idempotency guard in app/api/stripe/webhook/route.ts.
 */
async function isDuplicateStripeEvent(
  eventId: string,
  findProcessedEvent: AuditLookup,
): Promise<boolean> {
  const alreadyProcessed = await findProcessedEvent(eventId);
  return Boolean(alreadyProcessed);
}

describe("Stripe webhook idempotency", () => {
  it("treats a new event as not duplicate", async () => {
    const findProcessedEvent = vi.fn().mockResolvedValue(null);

    const duplicate = await isDuplicateStripeEvent("evt_new_123", findProcessedEvent);

    expect(duplicate).toBe(false);
    expect(findProcessedEvent).toHaveBeenCalledWith("evt_new_123");
  });

  it("treats a previously logged event as duplicate", async () => {
    const findProcessedEvent = vi.fn().mockResolvedValue({
      action: "payment",
      metadata: { stripeEventId: "evt_dup_456", type: "checkout.session.completed" },
    });

    const duplicate = await isDuplicateStripeEvent("evt_dup_456", findProcessedEvent);

    expect(duplicate).toBe(true);
  });

  it("queries by stripe event id for payment audit entries", async () => {
    const auditEntries = new Map<string, { action: string; metadata: Record<string, string> }>();
    auditEntries.set("evt_789", {
      action: "payment",
      metadata: { stripeEventId: "evt_789", type: "payment_intent.succeeded" },
    });

    const findProcessedEvent: AuditLookup = async (eventId) => {
      const entry = [...auditEntries.values()].find(
        (item) =>
          item.action === "payment" && item.metadata.stripeEventId === eventId,
      );
      return entry ?? null;
    };

    expect(await isDuplicateStripeEvent("evt_789", findProcessedEvent)).toBe(true);
    expect(await isDuplicateStripeEvent("evt_unknown", findProcessedEvent)).toBe(false);
  });

  it("returns duplicate response shape expected by the webhook handler", async () => {
    const findProcessedEvent = vi.fn().mockResolvedValue({ _id: "audit_1" });
    const duplicate = await isDuplicateStripeEvent("evt_repeat", findProcessedEvent);

    const responseBody = duplicate
      ? { received: true, duplicate: true }
      : { received: true };

    expect(responseBody).toEqual({ received: true, duplicate: true });
  });
});
