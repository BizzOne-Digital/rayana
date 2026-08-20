import Stripe from "stripe";

let stripeClient: Stripe | null | undefined;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

export function toStripeAmount(amount: number, currency: string): number {
  const zeroDecimal = ["jpy", "krw"].includes(currency.toLowerCase());
  return zeroDecimal ? Math.round(amount) : Math.round(amount * 100);
}

export function fromStripeAmount(amount: number, currency: string): number {
  const zeroDecimal = ["jpy", "krw"].includes(currency.toLowerCase());
  return zeroDecimal ? amount : amount / 100;
}
