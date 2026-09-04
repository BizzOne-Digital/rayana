import type { ImageMedia } from "@/models/shared";

export function seedImage(
  filename: string,
  alt: string,
  options: Partial<ImageMedia> = {},
): ImageMedia {
  const isPhoto = filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".webp");
  const basePath = isPhoto ? "/images/site" : "/images/seed";

  return {
    assetId: filename.replace(/\.[^.]+$/, ""),
    url: `${basePath}/${filename}`,
    width: options.width ?? (isPhoto ? 1200 : 1200),
    height: options.height ?? (isPhoto ? 900 : 800),
    mimeType: isPhoto ? "image/jpeg" : "image/svg+xml",
    alt,
    caption: "",
    focalPoint: { x: 0.5, y: 0.5 },
    decorative: false,
    ...options,
  };
}

export const SEED_IMAGES = {
  portrait1: seedImage(
    "rayana-story.jpg",
    "Rayana De Silva in reflective portrait",
    { width: 900, height: 1200 },
  ),
  portrait2: seedImage(
    "rayana-welcome.jpg",
    "Rayana De Silva, Master of Heart Matters",
    { width: 900, height: 1200 },
  ),
  privateConsultation: seedImage(
    "consultation-room.jpg",
    "Two comfortable armchairs facing each other in a softly lit consultation room with burgundy and ivory decor",
    { width: 1200, height: 900 },
  ),
  wisdomMentoring: seedImage(
    "reflective-notebook.jpg",
    "Notebook open to blank pages beside a warm cup of tea on a wooden table in afternoon light",
    { width: 1200, height: 900 },
  ),
  teachingsCourses: seedImage(
    "teachings-courses.jpg",
    "Stack of elegant notebooks with a golden bookmark on cream surface",
    { width: 1200, height: 900 },
  ),
  workshopsRetreats: seedImage(
    "retreat-room.jpg",
    "Empty retreat room with large windows overlooking misty mountains, rolled yoga mats and candles",
    { width: 1200, height: 900 },
  ),
  meditationChannel: seedImage(
    "energy-waves.jpg",
    "Abstract soft concentric circles of golden light on deep burgundy, like sound waves or energy",
    { width: 1200, height: 900 },
  ),
  sacredPortal: seedImage(
    "silk-gradient.jpg",
    "Soft burgundy and gold gradient circle texture, like warm light on silk",
    { width: 1200, height: 1200 },
  ),
  teachingExperience: seedImage(
    "online-teaching-desk.jpg",
    "Professional empty desk setup with closed laptop, notebook and pen in soft ring-light glow",
    { width: 1200, height: 750 },
  ),
  valueCompassion: seedImage(
    "value-compassion.jpg",
    "Single soft pink rose on burgundy velvet fabric",
    { width: 900, height: 1200 },
  ),
  valueTruth: seedImage(
    "value-truth.jpg",
    "Crystal prism catching soft golden light on ivory background",
    { width: 1200, height: 900 },
  ),
  valueIntegration: seedImage(
    "value-integration.jpg",
    "Smooth river stones stacked beside still misty water",
    { width: 1200, height: 900 },
  ),
  valuePresence: seedImage(
    "value-presence.jpg",
    "Single lit candle flame against deep plum background",
    { width: 1200, height: 900 },
  ),
  journalReflection: seedImage(
    "journal-reflection.jpg",
    "Open blank journal with pen in warm soft light",
    { width: 1200, height: 900 },
  ),
  meditationCorner: seedImage(
    "meditation-corner.jpg",
    "Empty meditation cushion in the corner of a quiet room with a lit candle",
    { width: 1200, height: 900 },
  ),
  sacredAltar: seedImage(
    "sacred-altar.jpg",
    "Altar cloth with a single flower in a vase and crystals in burgundy and gold tones",
    { width: 1200, height: 900 },
  ),
  forestPath: seedImage(
    "forest-crossroads.jpg",
    "Two quiet paths diverging in a misty forest with soft morning light",
    { width: 1200, height: 900 },
  ),
  oceanSunrise: seedImage(
    "calm-lake.jpg",
    "Calm lake reflecting sky and trees in mirror-like water at soft dawn light",
    { width: 1200, height: 900 },
  ),
  heartGlow: seedImage(
    "heart-glow.jpg",
    "Soft golden light glowing from within a heart-shaped negative space in burgundy mist",
    { width: 1200, height: 900 },
  ),
  calmLake: seedImage(
    "calm-lake.jpg",
    "Calm lake reflecting sky and trees in mirror-like water at soft dawn light",
    { width: 1200, height: 900 },
  ),
  forestCrossroads: seedImage(
    "forest-crossroads.jpg",
    "Two quiet paths diverging in a misty forest with soft morning light",
    { width: 1200, height: 900 },
  ),
  silkGradient: seedImage(
    "silk-gradient.jpg",
    "Soft burgundy and gold gradient circle texture, like warm light on silk",
    { width: 1200, height: 1200 },
  ),
  silkRibbon: seedImage(
    "silk-ribbon.jpg",
    "Burgundy silk ribbon on cream parchment with a soft gold accent",
    { width: 1200, height: 900 },
  ),
  calendarDesk: seedImage(
    "calendar-desk.jpg",
    "Calendar and pen on a clean ivory desk with soft natural light and a small candle",
    { width: 1200, height: 900 },
  ),
  envelopePen: seedImage(
    "envelope-pen.jpg",
    "Envelope and pen on a warm wooden surface with soft window light and a burgundy flower petal",
    { width: 1200, height: 900 },
  ),
  /** @deprecated Use specific site photos above; kept for legacy references */
  hands: seedImage(
    "journal-reflection.jpg",
    "Open blank journal with pen in warm soft light",
    { width: 1200, height: 900 },
  ),
  landscape: seedImage(
    "calm-lake.jpg",
    "Calm lake reflecting sky and trees in mirror-like water at soft dawn light",
    { width: 1200, height: 900 },
  ),
  session: seedImage(
    "consultation-room.jpg",
    "Two comfortable armchairs facing each other in a softly lit consultation room with burgundy and ivory decor",
    { width: 1200, height: 900 },
  ),
  texture: seedImage(
    "silk-ribbon.jpg",
    "Burgundy silk ribbon on cream parchment with a soft gold accent",
    { width: 1200, height: 900 },
  ),
  sacred: seedImage(
    "silk-gradient.jpg",
    "Soft burgundy and gold gradient circle texture, like warm light on silk",
    { width: 1200, height: 1200 },
  ),
  teaching: seedImage(
    "teachings-courses.jpg",
    "Stack of elegant notebooks with a golden bookmark on cream surface",
    { width: 1200, height: 900 },
  ),
  workshop: seedImage(
    "retreat-room.jpg",
    "Empty retreat room with large windows overlooking misty mountains, rolled yoga mats and candles",
    { width: 1200, height: 900 },
  ),
  nature: seedImage(
    "forest-crossroads.jpg",
    "Two quiet paths diverging in a misty forest with soft morning light",
    { width: 1200, height: 900 },
  ),
} as const;

export function defaultImage(index = 0): ImageMedia {
  const images = Object.values(SEED_IMAGES);
  return images[index % images.length]!;
}
