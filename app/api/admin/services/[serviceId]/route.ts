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
import { getServiceById } from "@/lib/repositories/services";
import { Service } from "@/models";
import { serviceUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ serviceId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { serviceId } = await context.params;
    const service = await getServiceById(serviceId);
    if (!service) return jsonError("Service not found", 404);
    return jsonOk({ service: { ...service, id: String(service._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { serviceId } = await context.params;
    const parsed = await parseJsonBody(request, serviceUpdateSchema);
    if (!parsed.success) return parsed.response;

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { $set: parsed.data },
      { new: true },
    );

    if (!service) return jsonError("Service not found", 404);

    await logAudit({
      action: "update",
      entityType: "Service",
      entityId: serviceId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated service ${service.title}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);
    revalidatePath("/booking");

    return jsonOk({ service: serializeDoc(service) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { serviceId } = await context.params;
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) return jsonError("Service not found", 404);

    await logAudit({
      action: "delete",
      entityType: "Service",
      entityId: serviceId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted service ${service.title}`,
      request,
    });

    revalidatePath("/services");
    return jsonOk({ deleted: true, id: serviceId });
  });
}
