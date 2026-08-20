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
import { GalleryImage } from "@/models";
import { galleryImageSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const images = await GalleryImage.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({ images: images.map((image) => ({ ...image, id: String(image._id) })) });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, galleryImageSchema);
    if (!parsed.success) return parsed.response;

    const image = await GalleryImage.create(parsed.data);

    await logAudit({
      action: "create",
      entityType: "GalleryImage",
      entityId: String(image._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created gallery image ${image.title}`,
      request,
    });

    revalidatePath("/gallery");
    return jsonCreated({ image: serializeDoc(image) });
  });
}
