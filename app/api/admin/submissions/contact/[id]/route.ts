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

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
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
