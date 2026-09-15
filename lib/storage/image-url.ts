export const PLACEHOLDER_IMAGE_URL = "/images/placeholder-image.svg";

export function resolvePublicImageUrl(url: string | undefined | null): string {
  if (!url?.trim()) return PLACEHOLDER_IMAGE_URL;
  if (url.startsWith("/uploads/")) return PLACEHOLDER_IMAGE_URL;
  return url;
}
