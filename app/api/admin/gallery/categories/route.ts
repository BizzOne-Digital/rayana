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
import { GalleryCategory } from "@/models";
import { galleryCategorySchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const categories = await GalleryCategory.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({
      categories: categories.map((category) => ({ ...category, id: String(category._id) })),
    });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, galleryCategorySchema);
    if (!parsed.success) return parsed.response;

    const category = await GalleryCategory.create(parsed.data);

    await logAudit({
      action: "create",
      entityType: "GalleryCategory",
      entityId: String(category._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created gallery category ${category.title}`,
      request,
    });

    revalidatePath("/gallery");
    return jsonCreated({ category: serializeDoc(category) });
  });
}
