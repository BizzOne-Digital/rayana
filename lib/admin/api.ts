export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

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

  const response = await fetch("/api/uploads", {
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
