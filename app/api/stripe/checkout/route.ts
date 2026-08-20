import type { NextRequest } from "next/server";
import {
  jsonCreated,
  jsonError,
  parseJsonBody,
  withPublicHandler,
} from "@/lib/api/utils";
import { getStripe, isStripeConfigured, toStripeAmount } from "@/lib/payments/stripe";
import { Booking } from "@/models";
import { stripeCheckoutSchema } from "@/lib/validation/admin";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    if (!isStripeConfigured()) {
      return jsonError("Stripe payments are not enabled", 503);
    }

    const parsed = await parseJsonBody(request, stripeCheckoutSchema);
    if (!parsed.success) return parsed.response;

    const booking = await Booking.findOne({
      referenceNumber: parsed.data.referenceNumber,
      status: { $in: ["hold", "pending_payment"] },
    });

    if (!booking) {
      return jsonError("Booking not found or no longer valid", 404);
    }

    if (booking.holdExpiresAt && booking.holdExpiresAt <= new Date()) {
      return jsonError("Booking hold has expired", 410);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const successUrl =
      parsed.data.successUrl ??
      `${siteUrl}/booking/confirmation?reference=${booking.referenceNumber}`;
    const cancelUrl =
      parsed.data.cancelUrl ??
      `${siteUrl}/booking?cancelled=${booking.referenceNumber}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: booking.client.email,
      client_reference_id: booking.referenceNumber,
      metadata: {
        referenceNumber: booking.referenceNumber,
        serviceSlug: booking.serviceSlug,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: booking.payment.currency.toLowerCase(),
            unit_amount: toStripeAmount(booking.payment.amount, booking.payment.currency),
            product_data: {
              name: booking.serviceTitle,
              description: `${booking.startLocal} (${booking.clientTimeZone})`,
            },
          },
        },
      ],
    });

    booking.payment.method = "stripe";
    booking.payment.stripeSessionId = session.id;
    booking.status = "pending_payment";
    await booking.save();

    return jsonCreated({
      sessionId: session.id,
      url: session.url,
    });
  });
}
