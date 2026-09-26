/**
 * Single source of truth for public-site SEO (titles, descriptions, keywords).
 * Edit this file — not the admin panel — to change search/social metadata.
 */
import { SITE_NAME } from "@/lib/constants";

/** Default meta description when CMS / page SEO fields are empty. */
export const SITE_DEFAULT_DESCRIPTION =
  "Private spiritual consultations, wisdom mentoring, and consciousness teachings with Rayana De Silva in Richmond, BC and online. Clarity, truth, and heart-centred integration.";

export const SITE_DEFAULT_KEYWORDS = [
  "Rayana De Silva",
  "Heart Matters",
  "spiritual consultation",
  "clairvoyance",
  "channeling",
  "wisdom mentoring",
  "consciousness",
  "meditation",
  "spiritual teacher",
  "Richmond BC",
  "British Columbia",
  "online spiritual sessions",
  "private consultation",
  "inner clarity",
  "heart-centred healing",
] as const;

export type PageSeoFallback = {
  title?: string;
  description?: string;
  keywords?: string[];
};

/** Per-route fallbacks (used when DB page SEO is missing or minimal). */
export const PAGE_SEO_BY_PATH: Record<string, PageSeoFallback> = {
  "/": {
    title: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    keywords: [...SITE_DEFAULT_KEYWORDS],
  },
  "/about": {
    title: "About Rayana De Silva",
    description:
      "Meet Rayana De Silva — spiritual mentor, consultant, and founder of Heart Matters. Her story, philosophy, and approach to clairvoyance, channeling, and conscious living.",
    keywords: [
      "about Rayana De Silva",
      "Heart Matters story",
      "spiritual mentor Vancouver",
      "clairvoyant consultant",
    ],
  },
  "/work-with-me": {
    title: "Work With Me",
    description:
      "Explore private consultations, wisdom mentoring, teachings, workshops, and group experiences with Rayana De Silva — in person in Richmond, BC or online.",
    keywords: [
      "spiritual services",
      "book consultation",
      "wisdom mentoring",
      "clairvoyance session",
    ],
  },
  "/pricing": {
    title: "Pricing & Programmes",
    description:
      "Session rates and programme pricing for private consultations, wisdom mentoring, and courses with Rayana De Silva. Transparent CAD pricing.",
    keywords: ["spiritual session pricing", "consultation rates", "mentoring packages"],
  },
  "/booking": {
    title: "Book a Consultation",
    description:
      "Schedule a private consultation or session with Rayana De Silva. Choose your service, select a time, and confirm your booking online.",
    keywords: ["book spiritual consultation", "schedule session", "Rayana booking"],
  },
  "/contact": {
    title: "Contact",
    description:
      "Contact Rayana De Silva with questions about sessions, programmes, or collaborations. Based in Richmond, British Columbia — serving clients locally and online.",
    keywords: ["contact Rayana De Silva", "Heart Matters contact", "spiritual teacher email"],
  },
  "/faqs": {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about private sessions, booking, rescheduling, online consultations, and working with Rayana De Silva.",
    keywords: ["spiritual session FAQ", "booking questions", "consultation preparation"],
  },
  "/testimonials": {
    title: "Testimonials",
    description:
      "Client reflections and testimonials from people who have worked with Rayana De Silva through Heart Matters consultations and teachings.",
    keywords: ["Rayana De Silva reviews", "spiritual consultation testimonials"],
  },
  "/blog": {
    title: "Reflections & Teachings",
    description:
      "Written reflections, insights, and teachings from Rayana De Silva on consciousness, clarity, inner listening, and living from the heart.",
    keywords: ["spiritual blog", "consciousness teachings", "Heart Matters reflections"],
  },
  "/shop": {
    title: "Shop",
    description:
      "Digital offerings and resources from Rayana De Silva and Heart Matters — tools to support your inner journey and integration.",
    keywords: ["spiritual shop", "digital teachings", "Heart Matters shop"],
  },
  "/media": {
    title: "Media & Teachings",
    description:
      "Video teachings, podcasts, and conversations from Rayana De Silva — explore media and featured content from Heart Matters.",
    keywords: ["spiritual teachings video", "Rayana De Silva media"],
  },
  "/write-a-review": {
    title: "Write a Review",
    description:
      "Share your experience working with Rayana De Silva. Your reflection helps others find clarity and heart-centred support.",
    keywords: ["leave a review", "client testimonial"],
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "How Rayana De Silva — Heart Matters collects, uses, and protects your personal information when you use this website or book sessions.",
    keywords: ["privacy policy"],
  },
  "/terms": {
    title: "Terms of Use",
    description: "Terms and conditions for using the Rayana De Silva — Heart Matters website and services.",
    keywords: ["terms of use"],
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "Important notices about spiritual consultations, educational content, and the scope of services offered by Rayana De Silva — Heart Matters.",
    keywords: ["spiritual disclaimer", "wellness disclaimer"],
  },
  "/cancellation-policy": {
    title: "Cancellation Policy",
    description:
      "Cancellation, rescheduling, and refund guidelines for sessions and programmes booked with Rayana De Silva.",
    keywords: ["cancellation policy", "reschedule session"],
  },
};

export function getPageSeoFallback(path: string): PageSeoFallback | undefined {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return PAGE_SEO_BY_PATH[normalized];
}

export function mergeKeywords(
  ...groups: (readonly string[] | string[] | undefined)[]
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const group of groups) {
    if (!group) continue;
    for (const word of group) {
      const key = word.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push(word.trim());
    }
  }
  return result;
}
