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
import { getPageById } from "@/lib/repositories/pages";
import { Page } from "@/models";
import { pageUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ pageId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { pageId } = await context.params;
    const page = await getPageById(pageId);
    if (!page) return jsonError("Page not found", 404);
    return jsonOk({ page: { ...page, id: String(page._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { pageId } = await context.params;
    const parsed = await parseJsonBody(request, pageUpdateSchema);
    if (!parsed.success) return parsed.response;

    const page = await Page.findByIdAndUpdate(
      pageId,
      { $set: { ...parsed.data, updatedBy: session.user.email }, $inc: { revision: 1 } },
      { new: true },
    );

    if (!page) return jsonError("Page not found", 404);

    await logAudit({
      action: "update",
      entityType: "Page",
      entityId: pageId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated page ${page.title}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath(page.route);
    return jsonOk({ page: serializeDoc(page) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { pageId } = await context.params;
    const page = await Page.findByIdAndDelete(pageId);
    if (!page) return jsonError("Page not found", 404);

    await logAudit({
      action: "delete",
      entityType: "Page",
      entityId: pageId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted page ${page.title}`,
      request,
    });

    revalidatePath(page.route);
    return jsonOk({ deleted: true, id: pageId });
  });
}
