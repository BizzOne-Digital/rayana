import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { ReviewSubmission, Testimonial } from "@/models";
import { submissionStatusSchema } from "@/lib/validation/admin";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const submissions = await ReviewSubmission.find()
      .sort({ submittedAt: -1 })
      .lean();

    return jsonOk({
      submissions: submissions.map((item) => ({ ...item, id: String(item._id) })),
    });
  });
}

export async function PATCH(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return jsonError("Missing id query parameter", 400);
    }

    const parsed = await parseJsonBody(request, submissionStatusSchema);
    if (!parsed.success) return parsed.response;

    const submission = await ReviewSubmission.findById(id);
    if (!submission) {
      return jsonError("Submission not found", 404);
    }

    submission.status = parsed.data.status as typeof submission.status;
    submission.reviewedAt = new Date();
    submission.reviewedBy = session.user.email ?? undefined;

    if (parsed.data.status === "approved") {
      const baseSlug = slugify(submission.name);
      let slug = baseSlug;
      let counter = 1;
      while (await Testimonial.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const testimonial = await Testimonial.create({
        slug,
        name: submission.showFullName ? submission.name : submission.name.split(" ")[0],
        role: submission.role,
        quote: submission.quote,
        excerpt: submission.excerpt,
        status: "approved",
        showFullName: submission.showFullName,
        submittedAt: submission.submittedAt,
      });

      submission.testimonialId = testimonial._id;
    }

    await submission.save();

    await logAudit({
      action: parsed.data.status === "approved" ? "publish" : "update",
      entityType: "ReviewSubmission",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Review submission marked ${parsed.data.status}`,
      request,
    });

    return jsonOk({ submission: serializeDoc(submission) });
  });
}
