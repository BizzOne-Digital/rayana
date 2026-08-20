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
import { BlogPost } from "@/models";
import { blogPostUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ postId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { postId } = await context.params;
    const post = await BlogPost.findById(postId).lean();
    if (!post) return jsonError("Blog post not found", 404);
    return jsonOk({ post: { ...post, id: String(post._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { postId } = await context.params;
    const parsed = await parseJsonBody(request, blogPostUpdateSchema);
    if (!parsed.success) return parsed.response;

    const updates = { ...parsed.data };
    if (updates.status === "published" && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    const post = await BlogPost.findByIdAndUpdate(postId, { $set: updates }, { new: true });
    if (!post) return jsonError("Blog post not found", 404);

    await logAudit({
      action: updates.status === "published" ? "publish" : "update",
      entityType: "BlogPost",
      entityId: postId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated blog post ${post.title}`,
      changes: updates as Record<string, unknown>,
      request,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return jsonOk({ post: serializeDoc(post) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { postId } = await context.params;
    const post = await BlogPost.findByIdAndDelete(postId);
    if (!post) return jsonError("Blog post not found", 404);

    await logAudit({
      action: "delete",
      entityType: "BlogPost",
      entityId: postId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted blog post ${post.title}`,
      request,
    });

    revalidatePath("/blog");
    return jsonOk({ deleted: true, id: postId });
  });
}
