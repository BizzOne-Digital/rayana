import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db/connect";
import { StoredUpload, type StoredUploadFolder } from "@/models/StoredUpload";

export const STORED_UPLOAD_FOLDERS: StoredUploadFolder[] = [
  "products",
  "gallery",
  "pages",
  "misc",
];

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export { PLACEHOLDER_IMAGE_URL, resolvePublicImageUrl } from "@/lib/storage/image-url";

export function isStoredUploadFolder(value: string): value is StoredUploadFolder {
  return (STORED_UPLOAD_FOLDERS as string[]).includes(value);
}

export function buildStoredUploadUrl(folder: StoredUploadFolder, filename: string) {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseStoredUploadUrl(url: string): { folder: StoredUploadFolder; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  const folder = match[1];
  const filename = match[2];
  if (!isStoredUploadFolder(folder)) return null;
  if (filename.includes("..") || filename.includes("/")) return null;
  return { folder, filename };
}

export function sanitizeUploadFilename(filename: string): string | null {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  return filename;
}

export function validateUploadFile(file: File, buffer: Buffer) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
  }
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error("Image must be 8MB or smaller");
  }
}

export function generateStoredFilename(mimeType: string) {
  const ext = EXT_BY_MIME[mimeType] ?? "bin";
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export async function saveStoredUpload(
  folder: StoredUploadFolder,
  buffer: Buffer,
  mimeType: string,
  originalName?: string,
) {
  await connectDB();
  const filename = generateStoredFilename(mimeType);
  await StoredUpload.create({
    folder,
    filename,
    mimeType,
    size: buffer.byteLength,
    data: buffer,
  });

  return {
    folder,
    filename,
    size: buffer.byteLength,
    url: buildStoredUploadUrl(folder, filename),
    originalName,
  };
}

export function storedUploadDataToBytes(data: unknown): Uint8Array | null {
  if (data == null) return null;
  if (Buffer.isBuffer(data)) return new Uint8Array(data);
  if (data instanceof Uint8Array) return data;
  if (typeof data === "object") {
    const record = data as { buffer?: Buffer; data?: number[] };
    if (record.buffer && Buffer.isBuffer(record.buffer)) {
      return new Uint8Array(record.buffer);
    }
    if (Array.isArray(record.data)) {
      return Uint8Array.from(record.data);
    }
  }
  return null;
}

export async function getStoredUpload(folder: StoredUploadFolder, filename: string) {
  await connectDB();
  const safe = sanitizeUploadFilename(decodeURIComponent(filename));
  if (!safe) return null;
  return StoredUpload.findOne({ folder, filename: safe }).lean();
}

export async function getStoredUploadBytes(folder: StoredUploadFolder, filename: string) {
  await connectDB();
  const safe = sanitizeUploadFilename(decodeURIComponent(filename));
  if (!safe) return null;

  const doc = await StoredUpload.findOne({ folder, filename: safe }).select(
    "mimeType size data",
  );
  if (!doc) return null;

  const bytes = storedUploadDataToBytes(doc.data);
  if (!bytes || bytes.byteLength === 0) return null;

  return {
    mimeType: doc.mimeType,
    size: doc.size,
    bytes,
  };
}

export async function deleteStoredUploadByUrl(url: string | undefined | null) {
  if (!url) return;
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return;
  await connectDB();
  await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
}
