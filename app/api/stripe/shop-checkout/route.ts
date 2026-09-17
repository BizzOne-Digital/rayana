import type { NextRequest } from "next/server";
import {
  jsonCreated,
  jsonError,
  parseJsonBody,
  withPublicHandler,
} from "@/lib/api/utils";
import { getStripe, isStripeConfigured, toStripeAmount } from "@/lib/payments/stripe";
import { Product } from "@/models";
import { z } from "zod";

const shopCheckoutSchema = z.object({
  productSlug: z.string().min(1).max(120),
});

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    if (!isStripeConfigured()) {
      return jsonError("Stripe payments are not enabled", 503);
    }

    const parsed = await parseJsonBody(request, shopCheckoutSchema);
    if (!parsed.success) return parsed.response;

    const product = await Product.findOne({
      slug: parsed.data.productSlug,
      visibility: "published",
    });

    if (!product) {
      return jsonError("Product not found", 404);
    }

    if (product.price <= 0) {
      return jsonError("This item is free — please use the contact page for access.", 400);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/shop/${product.slug}?purchased=1`,
      cancel_url: `${siteUrl}/shop/${product.slug}?cancelled=1`,
      metadata: {
        purchaseKind: "shop",
        productSlug: product.slug,
      },
      line_items: [
        product.stripePriceId
          ? { price: product.stripePriceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: product.currency.toLowerCase(),
                unit_amount: toStripeAmount(product.price, product.currency),
                product_data: {
                  name: product.name,
                  description: product.summary,
                },
              },
            },
      ],
    });

    return jsonCreated({
      sessionId: session.id,
      url: session.url,
    });
  });
}
