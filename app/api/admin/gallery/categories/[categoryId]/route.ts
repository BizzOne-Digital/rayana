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
import { GalleryCategory } from "@/models";
import { galleryCategoryUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ categoryId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { categoryId } = await context.params;
    const category = await GalleryCategory.findById(categoryId).lean();
    if (!category) return jsonError("Category not found", 404);
    return jsonOk({ category: { ...category, id: String(category._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { categoryId } = await context.params;
    const parsed = await parseJsonBody(request, galleryCategoryUpdateSchema);
    if (!parsed.success) return parsed.response;

    const category = await GalleryCategory.findByIdAndUpdate(
      categoryId,
      { $set: parsed.data },
      { new: true },
    );
    if (!category) return jsonError("Category not found", 404);

    await logAudit({
      action: "update",
      entityType: "GalleryCategory",
      entityId: categoryId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated gallery category ${category.title}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/gallery");
    return jsonOk({ category: serializeDoc(category) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { categoryId } = await context.params;
    const category = await GalleryCategory.findByIdAndDelete(categoryId);
    if (!category) return jsonError("Category not found", 404);

    await logAudit({
      action: "delete",
      entityType: "GalleryCategory",
      entityId: categoryId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted gallery category ${category.title}`,
      request,
    });

    revalidatePath("/gallery");
    return jsonOk({ deleted: true, id: categoryId });
  });
}
