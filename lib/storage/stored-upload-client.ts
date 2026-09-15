const FOLDERS = new Set(["products", "gallery", "pages", "misc"]);

function parseStoredUploadUrl(url: string): { folder: string; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  const folder = match[1];
  const filename = match[2];
  if (!FOLDERS.has(folder)) return null;
  if (filename.includes("..") || filename.includes("/")) return null;
  return { folder, filename };
}

/** Client-side helper: request deletion of a Mongo-stored upload by its public URL. */
export async function deleteStoredUploadByUrl(url: string | undefined | null) {
  const parsed = parseStoredUploadUrl(url ?? "");
  if (!parsed) return;

  await fetch(
    `/api/upload?folder=${encodeURIComponent(parsed.folder)}&filename=${encodeURIComponent(parsed.filename)}`,
    { method: "DELETE" },
  ).catch(() => undefined);
}
