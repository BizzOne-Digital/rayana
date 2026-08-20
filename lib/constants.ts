export const DB_NAME = "rayana_heart_matters";

export const DEFAULT_TIMEZONE =
  process.env.HOST_TIME_ZONE ?? "America/Vancouver";

export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY ?? "CAD";

export const SITE_NAME = "Rayana De Silva — Heart Matters";

export const UPLOAD_URL_PREFIX = "uploads";

/** @deprecated Use UPLOAD_ROOT env for a custom absolute path. Default is public/uploads. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "public/uploads";

export const RECORDINGS_DIR =
  process.env.RECORDINGS_DIR ?? "storage/recordings";

export const BOOKING_HOLD_MINUTES = 15;

export const RESCHEDULE_NOTICE_HOURS = 24;

export const PAGE_SECTION_TYPES = [
  "hero",
  "intro",
  "splitStory",
  "richText",
  "manifesto",
  "editorialQuote",
  "imagePair",
  "imageMarquee",
  "imageMosaic",
  "numberedSteps",
  "iconList",
  "serviceShowcase",
  "pricingSpotlight",
  "testimonialSlider",
  "faqPreview",
  "galleryStrip",
  "mediaFeature",
  "newsletter",
  "contactPanel",
  "bookingCTA",
] as const;

export type PageSectionType = (typeof PAGE_SECTION_TYPES)[number];

export const SYSTEM_PAGE_KEYS = [
  "home",
  "about",
  "services",
  "pricing",
  "gallery",
  "testimonials",
  "faqs",
  "contact",
  "blog",
  "media",
  "shop",
  "booking",
  "write-a-review",
  "privacy",
  "terms",
  "disclaimer",
  "cancellation-policy",
] as const;

export type SystemPageKey = (typeof SYSTEM_PAGE_KEYS)[number];

export const ADMIN_ROLES = ["super_admin", "editor"] as const;

export const BOOKING_STATUSES = [
  "hold",
  "pending_payment",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
  "rescheduled",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "held",
  "paid",
  "failed",
  "refunded",
  "cancelled",
] as const;

export const PAYMENT_METHODS = ["stripe", "e_transfer"] as const;

export const PRODUCT_TYPES = [
  "physical",
  "digital",
  "course",
  "gift-certificate",
] as const;

export const MEDIA_POST_TYPES = ["video", "podcast", "teaching"] as const;

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "publish",
  "login",
  "logout",
  "payment",
  "reschedule",
] as const;
