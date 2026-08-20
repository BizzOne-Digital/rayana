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
import { BlogPost } from "@/models";
import { blogPostSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const posts = await BlogPost.find().sort({ publishedAt: -1, createdAt: -1 }).lean();
    return jsonOk({ posts: posts.map((post) => ({ ...post, id: String(post._id) })) });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, blogPostSchema);
    if (!parsed.success) return parsed.response;

    const post = await BlogPost.create({
      ...parsed.data,
      publishedAt:
        parsed.data.status === "published"
          ? parsed.data.publishedAt ?? new Date()
          : parsed.data.publishedAt,
    });

    await logAudit({
      action: parsed.data.status === "published" ? "publish" : "create",
      entityType: "BlogPost",
      entityId: String(post._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created blog post ${post.title}`,
      request,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return jsonCreated({ post: serializeDoc(post) });
  });
}
