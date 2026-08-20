import type { NextRequest } from "next/server";
import {
  getClientIp,
  jsonCreated,
  jsonError,
  parseJsonBody,
  withPublicHandler,
} from "@/lib/api/utils";
import { rateLimit } from "@/lib/rate-limit";
import { ReviewSubmission } from "@/models";
import { reviewSubmissionSchema } from "@/lib/validation/common";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const ip = getClientIp(request) ?? "unknown";
    const limited = rateLimit(`reviews:${ip}`, { limit: 3, windowMs: 60_000 });
    if (!limited.success) {
      return jsonError("Too many requests. Please try again later.", 429);
    }

    const parsed = await parseJsonBody(request, reviewSubmissionSchema);
    if (!parsed.success) return parsed.response;

    if (parsed.data.honeypot) {
      return jsonCreated({ success: true });
    }

    const submission = await ReviewSubmission.create({
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      quote: parsed.data.quote,
      excerpt: parsed.data.excerpt,
      serviceSlug: parsed.data.serviceSlug,
      consentToPublish: parsed.data.consentToPublish,
      showFullName: parsed.data.showFullName,
      status: "pending",
      honeypotTriggered: false,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      submittedAt: new Date(),
    });

    return jsonCreated({
      success: true,
      id: String(submission._id),
      message: "Thank you. Your review has been submitted for consideration.",
    });
  });
}
