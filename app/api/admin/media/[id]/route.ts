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
import { MediaPost } from "@/models";
import { mediaPostUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const post = await MediaPost.findById(id).lean();
    if (!post) return jsonError("Media post not found", 404);
    return jsonOk({ post: { ...post, id: String(post._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const parsed = await parseJsonBody(request, mediaPostUpdateSchema);
    if (!parsed.success) return parsed.response;

    const updates = { ...parsed.data };
    if (updates.status === "published" && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    const post = await MediaPost.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!post) return jsonError("Media post not found", 404);

    await logAudit({
      action: updates.status === "published" ? "publish" : "update",
      entityType: "MediaPost",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated media post ${post.title}`,
      changes: updates as Record<string, unknown>,
      request,
    });

    revalidatePath("/media");
    return jsonOk({ post: serializeDoc(post) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const post = await MediaPost.findByIdAndDelete(id);
    if (!post) return jsonError("Media post not found", 404);

    await logAudit({
      action: "delete",
      entityType: "MediaPost",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted media post ${post.title}`,
      request,
    });

    revalidatePath("/media");
    return jsonOk({ deleted: true, id });
  });
}
