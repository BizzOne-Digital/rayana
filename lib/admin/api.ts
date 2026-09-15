export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

const LIST_KEYS = [
  "items",
  "pages",
  "services",
  "posts",
  "faqs",
  "testimonials",
  "products",
  "plans",
  "bookings",
  "images",
  "categories",
  "assets",
  "submissions",
] as const;

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;
    throw new AdminApiError(
      payload?.error ?? payload?.message ?? response.statusText,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/** Unwrap `{ page: ... }`, `{ settings: ... }`, etc. from admin GET/PATCH responses. */
export async function adminFetchResource<T>(
  path: string,
  resourceKey: string,
  options: RequestInit = {},
): Promise<T> {
  const payload = await adminFetch<Record<string, T>>(path, options);
  if (payload && typeof payload === "object" && resourceKey in payload) {
    return payload[resourceKey] as T;
  }
  return payload as T;
}

/** Normalize list endpoints that return `items` or a named array. */
export async function adminFetchList<T>(
  path: string,
  options: RequestInit = {},
): Promise<T[]> {
  const payload = await adminFetch<Record<string, unknown>>(path, options);
  if (Array.isArray(payload.items)) {
    return payload.items as T[];
  }
  for (const key of LIST_KEYS) {
    if (Array.isArray(payload[key])) {
      return payload[key] as T[];
    }
  }
  return [];
}

export type StoredUploadFolder = "products" | "gallery" | "pages" | "misc";

export async function adminUploadToFolder(
  file: File,
  folder: StoredUploadFolder,
): Promise<{ url: string; filename: string; size: number; folder: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;
    throw new AdminApiError(
      payload?.error ?? payload?.message ?? "Upload failed",
      response.status,
    );
  }

  return response.json();
}

export async function adminUpload(
  file: File,
  metadata?: { alt?: string; caption?: string; tags?: string[] },
): Promise<{ id: string; url: string; alt?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata?.alt) formData.append("alt", metadata.alt);
  if (metadata?.caption) formData.append("caption", metadata.caption);
  if (metadata?.tags?.length) {
    formData.append("tags", JSON.stringify(metadata.tags));
  }

  const uploaded = await adminUploadToFolder(file, "misc");
  return {
    id: uploaded.filename,
    url: uploaded.url,
    alt: metadata?.alt,
  };
}
