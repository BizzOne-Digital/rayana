import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { FAQ } from "@/models";
import { faqUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const faq = await FAQ.findById(id).lean();
    if (!faq) return jsonError("FAQ not found", 404);
    return jsonOk({ faq: { ...faq, id: String(faq._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const parsed = await parseJsonBody(request, faqUpdateSchema);
    if (!parsed.success) return parsed.response;

    const faq = await FAQ.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!faq) return jsonError("FAQ not found", 404);

    await logAudit({
      action: "update",
      entityType: "FAQ",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated FAQ ${faq.question}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/faqs");
    return jsonOk({ faq: serializeDoc(faq) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return jsonError("FAQ not found", 404);

    await logAudit({
      action: "delete",
      entityType: "FAQ",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted FAQ ${faq.question}`,
      request,
    });

    revalidatePath("/faqs");
    return jsonOk({ deleted: true, id });
  });
}
