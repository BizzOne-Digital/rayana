import { mkdir, unlink, writeFile } from "fs/promises";
import { dirname, join, normalize, relative } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_URL_PREFIX } from "@/lib/constants";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export type ImageVariant = {
  suffix: string;
  maxWidth: number;
  quality: number;
};

export const DEFAULT_VARIANTS: ImageVariant[] = [
  { suffix: "thumb", maxWidth: 400, quality: 80 },
  { suffix: "md", maxWidth: 1200, quality: 85 },
  { suffix: "full", maxWidth: 2400, quality: 88 },
];

export type UploadedImage = {
  id: string;
  filename: string;
  originalFilename: string;
  relativePath: string;
  url: string;
  mimeType: string;
  bytes: number;
  width: number;
  height: number;
  variants: Array<{
    suffix: string;
    relativePath: string;
    url: string;
    width: number;
    height: number;
    bytes: number;
  }>;
};

function getUploadRoot(): string {
  if (process.env.UPLOAD_ROOT) {
    return process.env.UPLOAD_ROOT;
  }

  return join(process.cwd(), "public", "uploads");
}

/** Resolve a path under the upload root with static cwd segments for Turbopack. */
function uploadAbsolutePath(...segments: string[]): string {
  if (process.env.UPLOAD_ROOT) {
    return join(/* turbopackIgnore: true */ process.env.UPLOAD_ROOT, ...segments);
  }

  return join(process.cwd(), "public", "uploads", ...segments);
}

function assertSafeRelativePath(relativePath: string): string {
  const normalized = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const root = getUploadRoot();
  const absolute = uploadAbsolutePath(normalized);

  if (!absolute.startsWith(root)) {
    throw new Error("Invalid upload path");
  }

  return relative(root, absolute);
}

export function validateMimeType(mimeType: string): void {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

export async function saveUploadedImage(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  variants: ImageVariant[] = DEFAULT_VARIANTS,
): Promise<UploadedImage> {
  if (buffer.byteLength > MAX_FILE_BYTES) {
    throw new Error("File exceeds maximum upload size");
  }

  validateMimeType(mimeType);

  const id = uuidv4();
  const safeOriginal = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const baseName = `${id}`;
  const folderRelative = join(new Date().getFullYear().toString(), baseName);
  const folderAbsolute = uploadAbsolutePath(folderRelative);

  await mkdir(folderAbsolute, { recursive: true });

  const metadata = await sharp(buffer).metadata();
  const sourceWidth = metadata.width ?? 0;
  const sourceHeight = metadata.height ?? 0;

  const uploadedVariants: UploadedImage["variants"] = [];
  let primaryRelativePath = "";
  let primaryUrl = "";
  let primaryBytes = 0;
  let primaryWidth = sourceWidth;
  let primaryHeight = sourceHeight;

  for (const variant of variants) {
    const filename = `${baseName}-${variant.suffix}.webp`;
    const relativePath = assertSafeRelativePath(join(folderRelative, filename));
    const absolutePath = uploadAbsolutePath(relativePath);

    await mkdir(dirname(absolutePath), { recursive: true });

    const resized = sharp(buffer).rotate().resize({
      width: Math.min(variant.maxWidth, sourceWidth || variant.maxWidth),
      withoutEnlargement: true,
      fit: "inside",
    });

    const output = await resized.webp({ quality: variant.quality }).toBuffer();
    const info = await sharp(output).metadata();

    await writeFile(absolutePath, output);

    const url = `/${UPLOAD_URL_PREFIX}/${relativePath.replace(/\\/g, "/")}`;

    uploadedVariants.push({
      suffix: variant.suffix,
      relativePath,
      url,
      width: info.width ?? 0,
      height: info.height ?? 0,
      bytes: output.byteLength,
    });

    if (variant.suffix === "full" || !primaryRelativePath) {
      primaryRelativePath = relativePath;
      primaryUrl = url;
      primaryBytes = output.byteLength;
      primaryWidth = info.width ?? sourceWidth;
      primaryHeight = info.height ?? sourceHeight;
    }
  }

  return {
    id,
    filename: `${baseName}.webp`,
    originalFilename: safeOriginal,
    relativePath: primaryRelativePath,
    url: primaryUrl,
    mimeType: "image/webp",
    bytes: primaryBytes,
    width: primaryWidth,
    height: primaryHeight,
    variants: uploadedVariants,
  };
}

export async function deleteUploadedImage(relativePath: string): Promise<void> {
  const safePath = assertSafeRelativePath(relativePath);
  const absolutePath = uploadAbsolutePath(safePath);

  try {
    await unlink(absolutePath);
  } catch {
    // File may already be removed.
  }

  const folder = dirname(absolutePath);
  const baseName = safePath.split(/[/\\]/).pop()?.replace(/-(thumb|md|full)\.webp$/, "") ?? "";

  if (baseName) {
    for (const suffix of ["thumb", "md", "full"]) {
      const variantPath = join(folder, `${baseName}-${suffix}.webp`);
      try {
        await unlink(variantPath);
      } catch {
        // ignore missing variants
      }
    }
  }
}

export { assertSafeRelativePath, getUploadRoot };
