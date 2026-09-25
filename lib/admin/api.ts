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
    credentials: "include",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string; details?: { fieldErrors?: Record<string, string[]> } }
      | null;
    const fieldMessages = payload?.details?.fieldErrors
      ? Object.values(payload.details.fieldErrors).flat().filter(Boolean)
      : [];
    const message =
      fieldMessages[0] ??
      payload?.error ??
      payload?.message ??
      response.statusText;
    throw new AdminApiError(message, response.status);
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
/** Ensure list rows from the API always have a string `_id` for tables and actions. */
export function normalizeAdminListRows<T extends { _id?: string; id?: string }>(
  rows: T[],
): Array<T & { _id: string }> {
  return rows.map((row) => ({
    ...row,
    _id: String(row._id ?? row.id ?? ""),
  }));
}

export async function adminFetchList<T extends { _id?: string; id?: string }>(
  path: string,
  options: RequestInit = {},
): Promise<Array<T & { _id: string }>> {
  const page = await adminFetchPaginated<T>(path, options);
  return normalizeAdminListRows(page.items);
}

/** List endpoints may return `items` or a named array (`plans`, `products`, etc.). */
export async function adminFetchPaginated<T>(
  path: string,
  options: RequestInit = {},
): Promise<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const payload = await adminFetch<Record<string, unknown>>(path, options);
  let items: T[] = [];
  if (Array.isArray(payload.items)) {
    items = payload.items as T[];
  } else if (Array.isArray(payload.submissions)) {
    items = payload.submissions as T[];
  } else {
    for (const key of LIST_KEYS) {
      if (Array.isArray(payload[key])) {
        items = payload[key] as T[];
        break;
      }
    }
  }

  const total = Number(payload.total ?? items.length);
  const page = Number(payload.page ?? 1);
  const limit = Number(payload.limit ?? (items.length || 1));
  const totalPages = Number(payload.totalPages ?? Math.max(1, Math.ceil(total / limit)));

  return { items, total, page, limit, totalPages };
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
    credentials: "include",
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
