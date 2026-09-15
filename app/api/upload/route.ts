import type { NextRequest } from "next/server";
import { jsonError, jsonOk, logAudit, withAdmin } from "@/lib/api/utils";
import {
  deleteStoredUploadByUrl,
  isStoredUploadFolder,
  saveStoredUpload,
  validateUploadFile,
  buildStoredUploadUrl,
} from "@/lib/storage/stored-upload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder")?.toString() ?? "misc";

    if (!(file instanceof File)) {
      return jsonError("File is required", 400);
    }

    if (!isStoredUploadFolder(folderRaw)) {
      return jsonError("Invalid upload folder", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      validateUploadFile(file, buffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid file";
      return jsonError(message, 400);
    }

    const saved = await saveStoredUpload(folderRaw, buffer, file.type, file.name);

    await logAudit({
      action: "create",
      entityType: "StoredUpload",
      entityId: `${saved.folder}/${saved.filename}`,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Uploaded ${saved.filename} to ${saved.folder}`,
      request,
    });

    return jsonOk({
      success: true,
      url: saved.url,
      filename: saved.filename,
      size: saved.size,
      folder: saved.folder,
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withAdmin(request, async () => {
    const url = new URL(request.url);
    const folder = url.searchParams.get("folder");
    const filename = url.searchParams.get("filename");

    if (!folder || !filename || !isStoredUploadFolder(folder)) {
      return jsonError("Invalid upload reference", 400);
    }

    await deleteStoredUploadByUrl(buildStoredUploadUrl(folder, filename));
    return jsonOk({ deleted: true });
  });
}
