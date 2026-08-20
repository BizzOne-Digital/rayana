import type { NextRequest } from "next/server";
import {
  createOne,
  jsonCreated,
  jsonError,
  logAudit,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { saveUploadedImage } from "@/lib/storage";
import { MediaAsset, type IMediaAsset } from "@/models";
import { uploadMetadataSchema } from "@/lib/validation/admin";

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("File is required", 400);
    }

    const metadataParsed = uploadMetadataSchema.safeParse({
      alt: formData.get("alt")?.toString() ?? "",
      caption: formData.get("caption")?.toString() ?? "",
      tags: formData.get("tags")?.toString() ?? "",
    });

    if (!metadataParsed.success) {
      return jsonError("Invalid metadata", 422, metadataParsed.error.flatten());
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let uploaded;
    try {
      uploaded = await saveUploadedImage(buffer, file.name, file.type);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      return jsonError(message, 400);
    }

    const tags = metadataParsed.data.tags
      ? metadataParsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

    const asset = await createOne<IMediaAsset>(MediaAsset, {
      filename: uploaded.filename,
      originalFilename: uploaded.originalFilename,
      url: uploaded.url,
      relativePath: uploaded.relativePath,
      width: uploaded.width,
      height: uploaded.height,
      mimeType: uploaded.mimeType,
      bytes: uploaded.bytes,
      alt: metadataParsed.data.alt ?? "",
      caption: metadataParsed.data.caption ?? "",
      uploadedBy: session.user.email ?? undefined,
      tags,
      status: "active",
    });

    await logAudit({
      action: "create",
      entityType: "MediaAsset",
      entityId: String(asset._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Uploaded image ${uploaded.originalFilename}`,
      request,
    });

    return jsonCreated({
      asset: serializeDoc(asset),
      variants: uploaded.variants,
    });
  });
}
