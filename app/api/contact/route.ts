import type { NextRequest } from "next/server";
import {
  getClientIp,
  jsonCreated,
  jsonError,
  parseJsonBody,
  withPublicHandler,
} from "@/lib/api/utils";
import { sendEmail } from "@/lib/email";
import { contactNotificationEmail } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/repositories/settings";
import { ContactSubmission } from "@/models";
import { contactSubmissionSchema } from "@/lib/validation/common";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const ip = getClientIp(request) ?? "unknown";
    const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!limited.success) {
      return jsonError("Too many requests. Please try again later.", 429);
    }

    const parsed = await parseJsonBody(request, contactSubmissionSchema);
    if (!parsed.success) return parsed.response;

    if (parsed.data.honeypot) {
      return jsonCreated({ success: true });
    }

    const submission = await ContactSubmission.create({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
      source: "contact_page",
      status: "new",
      honeypotTriggered: false,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      submittedAt: new Date(),
    });

    const settings = await getSiteSettings();
    const notifyEmail = settings?.contact.email;

    if (notifyEmail) {
      const template = contactNotificationEmail({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        subject: submission.subject,
        message: submission.message,
        submittedAt: submission.submittedAt,
      });

      await sendEmail({
        to: notifyEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
        replyTo: submission.email,
      });
    }

    return jsonCreated({
      success: true,
      id: String(submission._id),
    });
  });
}
