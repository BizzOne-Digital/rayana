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
import { getSiteSettings, updateSiteSettings } from "@/lib/repositories/settings";
import { siteSettingsUpdateSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const settings = await getSiteSettings();
    if (!settings) return jsonError("Settings not found", 404);
    return jsonOk({ settings: { ...settings, id: String(settings._id) } });
  });
}

export async function PATCH(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, siteSettingsUpdateSchema);
    if (!parsed.success) return parsed.response;

    const settings = await updateSiteSettings(parsed.data as never);
    if (!settings) return jsonError("Settings not found", 404);

    await logAudit({
      action: "update",
      entityType: "SiteSettings",
      entityId: String(settings._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: "Updated site settings",
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/", "layout");
    return jsonOk({ settings: serializeDoc(settings as never) });
  });
}
