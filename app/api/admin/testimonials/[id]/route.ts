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
import { Testimonial } from "@/models";
import { testimonialUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const testimonial = await Testimonial.findById(id).lean();
    if (!testimonial) return jsonError("Testimonial not found", 404);
    return jsonOk({ testimonial: { ...testimonial, id: String(testimonial._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const parsed = await parseJsonBody(request, testimonialUpdateSchema);
    if (!parsed.success) return parsed.response;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true },
    );
    if (!testimonial) return jsonError("Testimonial not found", 404);

    await logAudit({
      action: parsed.data.status === "approved" ? "publish" : "update",
      entityType: "Testimonial",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated testimonial from ${testimonial.name}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/testimonials");
    return jsonOk({ testimonial: serializeDoc(testimonial) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return jsonError("Testimonial not found", 404);

    await logAudit({
      action: "delete",
      entityType: "Testimonial",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted testimonial from ${testimonial.name}`,
      request,
    });

    revalidatePath("/testimonials");
    return jsonOk({ deleted: true, id });
  });
}
