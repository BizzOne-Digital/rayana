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
import { MediaPost } from "@/models";
import { mediaPostSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const posts = await MediaPost.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({ posts: posts.map((post) => ({ ...post, id: String(post._id) })) });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, mediaPostSchema);
    if (!parsed.success) return parsed.response;

    const post = await MediaPost.create({
      ...parsed.data,
      publishedAt:
        parsed.data.status === "published"
          ? parsed.data.publishedAt ?? new Date()
          : parsed.data.publishedAt,
    });

    await logAudit({
      action: parsed.data.status === "published" ? "publish" : "create",
      entityType: "MediaPost",
      entityId: String(post._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created media post ${post.title}`,
      request,
    });

    revalidatePath("/media");
    return jsonCreated({ post: serializeDoc(post) });
  });
}
