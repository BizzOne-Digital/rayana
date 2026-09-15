import type { NextRequest } from "next/server";
import { getStoredUpload, isStoredUploadFolder, sanitizeUploadFilename } from "@/lib/storage/stored-upload";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { folder, filename } = await context.params;

  if (!isStoredUploadFolder(folder)) {
    return new Response("Not found", { status: 404 });
  }

  const safeName = sanitizeUploadFilename(filename);
  if (!safeName) {
    return new Response("Invalid filename", { status: 400 });
  }

  const doc = await getStoredUpload(folder, safeName);
  if (!doc?.data) {
    return new Response("Not found", { status: 404 });
  }

  const raw = doc.data as Buffer | { type: string; data: number[] };
  const bytes = Buffer.isBuffer(raw) ? new Uint8Array(raw) : Uint8Array.from(raw.data);

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(doc.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
