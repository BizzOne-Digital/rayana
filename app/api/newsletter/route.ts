import type { NextRequest } from "next/server";
import {
  jsonCreated,
  jsonError,
  parseJsonBody,
  withPublicHandler,
} from "@/lib/api/utils";
import { rateLimit } from "@/lib/rate-limit";
import { NewsletterSubscriber } from "@/models";
import { newsletterSubscribeSchema } from "@/lib/validation/common";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const parsed = await parseJsonBody(request, newsletterSubscribeSchema);
    if (!parsed.success) return parsed.response;

    const limited = rateLimit(`newsletter:${parsed.data.email}`, {
      limit: 3,
      windowMs: 60_000,
    });
    if (!limited.success) {
      return jsonError("Too many requests. Please try again later.", 429);
    }

    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: parsed.data.email.toLowerCase() },
      {
        $set: {
          status: "active",
          source: parsed.data.source ?? "website",
          subscribedAt: new Date(),
          unsubscribedAt: undefined,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return jsonCreated({
      success: true,
      email: subscriber.email,
      status: subscriber.status,
    });
  });
}
