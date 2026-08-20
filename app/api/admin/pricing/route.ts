import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  jsonCreated,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { PricingPlan } from "@/models";
import { pricingPlanSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const plans = await PricingPlan.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({ plans: plans.map((plan) => ({ ...plan, id: String(plan._id) })) });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, pricingPlanSchema);
    if (!parsed.success) return parsed.response;

    const plan = await PricingPlan.create(parsed.data);

    await logAudit({
      action: "create",
      entityType: "PricingPlan",
      entityId: String(plan._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created pricing plan ${plan.title}`,
      request,
    });

    revalidatePath("/pricing");
    return jsonCreated({ plan: serializeDoc(plan) });
  });
}
