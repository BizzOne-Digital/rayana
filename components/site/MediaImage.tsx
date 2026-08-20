"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageMedia } from "@/models/shared";

type MediaImageProps = {
  image: ImageMedia;
  className?: string;
  imageClassName?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  aspectClassName?: string;
};

export function MediaImage({
  image,
  className,
  imageClassName,
  fill = true,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  aspectClassName,
}: MediaImageProps) {
  const focalX = (image.focalPoint?.x ?? 0.5) * 100;
  const focalY = (image.focalPoint?.y ?? 0.5) * 100;
  const objectPosition = `${focalX}% ${focalY}%`;

  if (fill) {
    return (
      <div className={cn("relative h-full w-full min-h-full overflow-hidden", aspectClassName, className)}>
        <Image
          src={image.url}
          alt={image.decorative ? "" : image.alt || ""}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
          style={{ objectPosition }}
        />
        {image.caption ? (
          <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-velvet-night/70 to-transparent px-4 py-3 text-xs text-warm-ivory">
            {image.caption}
          </figcaption>
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={image.url}
      alt={image.decorative ? "" : image.alt || ""}
      width={image.width ?? 1200}
      height={image.height ?? 800}
      priority={priority}
      className={cn("object-cover", className)}
      style={{ objectPosition }}
    />
  );
}
