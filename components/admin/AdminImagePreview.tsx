"use client";

type AdminImagePreviewProps = {
  src: string;
  alt?: string;
  className?: string;
};

/** Admin preview — plain img so /api/uploads and static paths always render. */
export function AdminImagePreview({ src, alt = "", className }: AdminImagePreviewProps) {
  if (!src?.trim()) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className ?? "h-full w-full object-cover"}
      loading="lazy"
      decoding="async"
    />
  );
}
