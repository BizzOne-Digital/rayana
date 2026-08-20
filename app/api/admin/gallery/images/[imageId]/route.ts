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
import { GalleryImage } from "@/models";
import { galleryImageUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ imageId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { imageId } = await context.params;
    const image = await GalleryImage.findById(imageId).lean();
    if (!image) return jsonError("Image not found", 404);
    return jsonOk({ image: { ...image, id: String(image._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { imageId } = await context.params;
    const parsed = await parseJsonBody(request, galleryImageUpdateSchema);
    if (!parsed.success) return parsed.response;

    const image = await GalleryImage.findByIdAndUpdate(
      imageId,
      { $set: parsed.data },
      { new: true },
    );
    if (!image) return jsonError("Image not found", 404);

    await logAudit({
      action: "update",
      entityType: "GalleryImage",
      entityId: imageId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated gallery image ${image.title}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/gallery");
    return jsonOk({ image: serializeDoc(image) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { imageId } = await context.params;
    const image = await GalleryImage.findByIdAndDelete(imageId);
    if (!image) return jsonError("Image not found", 404);

    await logAudit({
      action: "delete",
      entityType: "GalleryImage",
      entityId: imageId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted gallery image ${image.title}`,
      request,
    });

    revalidatePath("/gallery");
    return jsonOk({ deleted: true, id: imageId });
  });
}
