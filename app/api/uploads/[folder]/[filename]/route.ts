import type { NextRequest } from "next/server";
import {
  getStoredUploadBytes,
  isStoredUploadFolder,
  sanitizeUploadFilename,
} from "@/lib/storage/stored-upload";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { folder, filename } = await context.params;

  if (!isStoredUploadFolder(folder)) {
    return new Response("Not found", { status: 404 });
  }

  const safeName = sanitizeUploadFilename(decodeURIComponent(filename));
  if (!safeName) {
    return new Response("Invalid filename", { status: 400 });
  }

  const file = await getStoredUploadBytes(folder, safeName);
  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Buffer.from(file.bytes), {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
