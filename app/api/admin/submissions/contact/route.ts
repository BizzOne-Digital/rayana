import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { ContactSubmission } from "@/models";
import { submissionStatusSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const submissions = await ContactSubmission.find()
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

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { $set: { status: parsed.data.status } },
      { new: true },
    );

    if (!submission) {
      return jsonError("Submission not found", 404);
    }

    await logAudit({
      action: "update",
      entityType: "ContactSubmission",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated contact submission status to ${parsed.data.status}`,
      request,
    });

    return jsonOk({ submission: serializeDoc(submission) });
  });
}
