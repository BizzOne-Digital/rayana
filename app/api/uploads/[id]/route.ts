import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  logAudit,
  withAdmin,
} from "@/lib/api/utils";
import { deleteUploadedImage } from "@/lib/storage";
import { MediaAsset } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const asset = await MediaAsset.findById(id);

    if (!asset) {
      return jsonError("Asset not found", 404);
    }

    try {
      await deleteUploadedImage(asset.relativePath);
    } catch {
      // Continue removing database record even if file deletion fails.
    }

    await MediaAsset.deleteOne({ _id: asset._id });

    await logAudit({
      action: "delete",
      entityType: "MediaAsset",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted uploaded asset ${asset.originalFilename}`,
      request,
    });

    return jsonOk({ deleted: true, id });
  });
}
