import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { jsonError, jsonOk, logAudit, withPublicHandler } from "@/lib/api/utils";
import { confirmBooking } from "@/lib/booking/service";
import { fromStripeAmount, getStripe, isStripeConfigured } from "@/lib/payments/stripe";
import { AuditLog, Booking } from "@/models";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    if (!isStripeConfigured()) {
      return jsonError("Stripe is not configured", 503);
    }

    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return jsonError("Missing Stripe signature", 400);
    }

    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid signature";
      return jsonError(message, 400);
    }

    const alreadyProcessed = await AuditLog.findOne({
      action: "payment",
      "metadata.stripeEventId": event.id,
    }).lean();

    if (alreadyProcessed) {
      return jsonOk({ received: true, duplicate: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const referenceNumber =
          session.metadata?.referenceNumber ?? session.client_reference_id;

        if (referenceNumber) {
          const booking = await Booking.findOne({ referenceNumber });
          if (booking) {
            booking.status = "confirmed";
            booking.confirmedAt = new Date();
            booking.holdExpiresAt = undefined;
            booking.payment.status = "paid";
            booking.payment.paidAt = new Date();
            booking.payment.stripeSessionId = session.id;
            if (typeof session.payment_intent === "string") {
              booking.payment.stripePaymentIntentId = session.payment_intent;
            }
            await booking.save();
          } else {
            await confirmBooking(referenceNumber, "stripe");
          }
        }
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const referenceNumber = paymentIntent.metadata?.referenceNumber;
        if (referenceNumber) {
          await Booking.findOneAndUpdate(
            { referenceNumber },
            {
              $set: {
                status: "confirmed",
                confirmedAt: new Date(),
                "payment.status": "paid",
                "payment.paidAt": new Date(),
                "payment.stripePaymentIntentId": paymentIntent.id,
                "payment.amount": fromStripeAmount(
                  paymentIntent.amount_received,
                  paymentIntent.currency,
                ),
              },
              $unset: { holdExpiresAt: "" },
            },
          );
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const referenceNumber = paymentIntent.metadata?.referenceNumber;
        if (referenceNumber) {
          await Booking.findOneAndUpdate(
            { referenceNumber },
            { $set: { "payment.status": "failed" } },
          );
        }
        break;
      }
      default:
        break;
    }

    await logAudit({
      action: "payment",
      entityType: "StripeWebhook",
      summary: `Processed Stripe event ${event.type}`,
      metadata: {
        stripeEventId: event.id,
        type: event.type,
      },
      request,
    });

    return jsonOk({ received: true });
  });
}
