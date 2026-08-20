import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  createOne,
  jsonCreated,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { listPages } from "@/lib/repositories/pages";
import { Page, type IPage } from "@/models";
import { pageCreateSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const pages = await listPages();
    return jsonOk({
      pages: pages.map((page) => ({ ...page, id: String(page._id) })),
    });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, pageCreateSchema);
    if (!parsed.success) return parsed.response;

    const page = await createOne<IPage>(Page, {
      ...parsed.data,
      createdBy: session.user.email ?? undefined,
      updatedBy: session.user.email ?? undefined,
    });

    await logAudit({
      action: "create",
      entityType: "Page",
      entityId: String(page._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created page ${page.title}`,
      request,
    });

    if (page.status === "published") {
      revalidatePath(page.route);
    }

    return jsonCreated({ page: serializeDoc(page) });
  });
}
