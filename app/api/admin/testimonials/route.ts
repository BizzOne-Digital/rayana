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
import { Testimonial } from "@/models";
import { testimonialSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const testimonials = await Testimonial.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({
      testimonials: testimonials.map((item) => ({ ...item, id: String(item._id) })),
    });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, testimonialSchema);
    if (!parsed.success) return parsed.response;

    const testimonial = await Testimonial.create(parsed.data);

    await logAudit({
      action: "create",
      entityType: "Testimonial",
      entityId: String(testimonial._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created testimonial from ${testimonial.name}`,
      request,
    });

    revalidatePath("/testimonials");
    return jsonCreated({ testimonial: serializeDoc(testimonial) });
  });
}
