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
import { listServices } from "@/lib/repositories/services";
import { Service } from "@/models";
import { serviceCreateSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const services = await listServices();
    return jsonOk({
      services: services.map((service) => ({ ...service, id: String(service._id) })),
    });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, serviceCreateSchema);
    if (!parsed.success) return parsed.response;

    const service = await Service.create({
      ...parsed.data,
      cardCta: parsed.data.cardCta ?? { label: "Learn More", href: `/services/${parsed.data.slug}` },
    });

    await logAudit({
      action: "create",
      entityType: "Service",
      entityId: String(service._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created service ${service.title}`,
      request,
    });

    revalidatePath("/services");
    revalidatePath(`/services/${service.slug}`);

    return jsonCreated({ service: serializeDoc(service) });
  });
}
