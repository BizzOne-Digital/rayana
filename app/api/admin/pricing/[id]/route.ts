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
import { PricingPlan } from "@/models";
import { pricingPlanUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const plan = await PricingPlan.findById(id).lean();
    if (!plan) return jsonError("Pricing plan not found", 404);
    return jsonOk({ plan: { ...plan, id: String(plan._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const parsed = await parseJsonBody(request, pricingPlanUpdateSchema);
    if (!parsed.success) return parsed.response;

    const plan = await PricingPlan.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!plan) return jsonError("Pricing plan not found", 404);

    await logAudit({
      action: "update",
      entityType: "PricingPlan",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated pricing plan ${plan.title}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/pricing");
    return jsonOk({ plan: serializeDoc(plan) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const plan = await PricingPlan.findByIdAndDelete(id);
    if (!plan) return jsonError("Pricing plan not found", 404);

    await logAudit({
      action: "delete",
      entityType: "PricingPlan",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted pricing plan ${plan.title}`,
      request,
    });

    revalidatePath("/pricing");
    return jsonOk({ deleted: true, id });
  });
}
