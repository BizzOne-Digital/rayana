import type { ImageMedia } from "@/models/shared";

export function seedImage(
  filename: string,
  alt: string,
  options: Partial<ImageMedia> = {},
): ImageMedia {
  return {
    assetId: filename.replace(/\.[^.]+$/, ""),
    url: `/images/seed/${filename}`,
    width: 1200,
    height: 800,
    mimeType: "image/svg+xml",
    alt,
    caption: "",
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    ...options,
  };
}

export const SEED_IMAGES = {
  portrait1: seedImage(
    "portrait-1.svg",
    "Editorial portrait placeholder in warm burgundy tones",
  ),
  portrait2: seedImage(
    "portrait-2.svg",
    "Secondary portrait composition with golden accent line",
  ),
  hands: seedImage("hands-detail.svg", "Close detail of hands in warm light"),
  landscape: seedImage(
    "landscape.svg",
    "Coastal landscape at dusk with golden horizon",
  ),
  session: seedImage(
    "session-atmosphere.svg",
    "Quiet session space with soft ambient light",
  ),
  texture: seedImage(
    "texture-abstract.svg",
    "Velvet texture with abstract golden thread",
    { decorative: true },
  ),
  sacred: seedImage(
    "sacred-space.svg",
    "Sacred space with gentle luminous centre",
  ),
  teaching: seedImage(
    "teaching.svg",
    "Teaching atmosphere with layered parchment tones",
  ),
  workshop: seedImage(
    "workshop.svg",
    "Gathered circle suggesting workshop presence",
  ),
  nature: seedImage(
    "nature.svg",
    "Forest path through mist and morning light",
  ),
} as const;

export function defaultImage(index = 0): ImageMedia {
  const images = Object.values(SEED_IMAGES);
  return images[index % images.length]!;
}
