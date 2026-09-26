/**
 * Single source of truth for public-site SEO (titles, descriptions, keywords).
 * Edit this file — not the admin panel — to change search/social metadata.
 */
import { SITE_NAME } from "@/lib/constants";

/** Default meta description when a route has no specific entry. */
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

/** Static routes */
export const PAGE_SEO_BY_PATH: Record<string, PageSeoFallback> = {
  "/": {
    title: SITE_NAME,
    description:
      "Rayana De Silva offers private clairvoyance and channel consultations, wisdom mentoring, and live teachings through Heart Matters — in Richmond, BC and online worldwide.",
    keywords: [...SITE_DEFAULT_KEYWORDS],
  },
  "/about": {
    title: "About Rayana De Silva",
    description:
      "Learn about Rayana De Silva — spiritual mentor, clairvoyant consultant, and founder of Heart Matters. Her path, philosophy, and heart-centred approach to consciousness and truth.",
    keywords: [
      "about Rayana De Silva",
      "Heart Matters founder",
      "spiritual mentor Richmond BC",
      "clairvoyant teacher",
    ],
  },
  "/work-with-me": {
    title: "Work With Me",
    description:
      "Discover ways to work with Rayana De Silva — private consultations, wisdom mentoring, Zoom teachings, workshops, and group experiences for clarity and conscious living.",
    keywords: [
      "work with Rayana De Silva",
      "spiritual services BC",
      "clairvoyance consultation",
      "wisdom mentoring",
    ],
  },
  "/pricing": {
    title: "Pricing & Programmes",
    description:
      "View session rates and programme fees for private consultations, wisdom mentoring, The Deepening, and Experience the Journey Within — transparent pricing in CAD.",
    keywords: [
      "spiritual session pricing",
      "consultation rates Vancouver",
      "mentoring programme cost",
    ],
  },
  "/booking": {
    title: "Book a Consultation",
    description:
      "Book a private consultation or wisdom mentoring session with Rayana De Silva. Select your service, choose an available time, and confirm your appointment online.",
    keywords: [
      "book spiritual consultation",
      "schedule clairvoyance session",
      "Rayana De Silva booking",
    ],
  },
  "/contact": {
    title: "Contact",
    description:
      "Get in touch with Rayana De Silva for questions about sessions, programmes, or collaborations. Based in Richmond, British Columbia — serving clients in person and online.",
    keywords: [
      "contact Rayana De Silva",
      "Heart Matters email",
      "spiritual teacher Richmond BC",
    ],
  },
  "/faqs": {
    title: "Frequently Asked Questions",
    description:
      "Find answers about private sessions, booking, rescheduling, online consultations, preparation, and what to expect when working with Rayana De Silva.",
    keywords: [
      "spiritual consultation FAQ",
      "session preparation",
      "booking policy Heart Matters",
    ],
  },
  "/testimonials": {
    title: "Testimonials",
    description:
      "Read client testimonials and heartfelt reflections from people who have received consultations, mentoring, and teachings with Rayana De Silva and Heart Matters.",
    keywords: [
      "Rayana De Silva testimonials",
      "spiritual consultation reviews",
      "Heart Matters client stories",
    ],
  },
  "/blog": {
    title: "Reflections & Teachings",
    description:
      "Essays and teachings from Rayana De Silva on inner listening, honesty, consciousness, and living with clarity — reflections from the Heart Matters path.",
    keywords: [
      "spiritual reflections blog",
      "consciousness teachings",
      "Rayana De Silva writings",
    ],
  },
  "/shop": {
    title: "Shop",
    description:
      "Browse digital offerings from Heart Matters — recorded teachings and chakra modules you can study at your own pace to support alignment and inner awareness.",
    keywords: [
      "Heart Matters shop",
      "chakra modules",
      "spiritual digital courses",
    ],
  },
  "/media": {
    title: "Media & Teachings",
    description:
      "Watch and listen to teachings, conversations, and featured media from Rayana De Silva — video, podcast, and teaching content from Heart Matters.",
    keywords: [
      "Rayana De Silva video teachings",
      "spiritual podcast",
      "Heart Matters media",
    ],
  },
  "/write-a-review": {
    title: "Write a Review",
    description:
      "Share your experience after a session or programme with Rayana De Silva. Your review helps others who are seeking clarity and heart-centred spiritual support.",
    keywords: ["write a review", "client testimonial Heart Matters"],
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "Privacy policy for Rayana De Silva — Heart Matters: how personal information is collected, used, and protected when you use this website or book services.",
    keywords: ["privacy policy Heart Matters"],
  },
  "/terms": {
    title: "Terms of Use",
    description:
      "Terms of use for the Rayana De Silva — Heart Matters website, including acceptable use, intellectual property, and conditions for accessing online content.",
    keywords: ["terms of use Heart Matters"],
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "Disclaimer for spiritual consultations and educational content from Rayana De Silva — Heart Matters. Not medical, psychological, or legal advice.",
    keywords: ["spiritual wellness disclaimer", "consultation disclaimer"],
  },
  "/cancellation-policy": {
    title: "Cancellation Policy",
    description:
      "Cancellation and rescheduling policy for sessions and programmes booked with Rayana De Silva — notice periods, fees, and how to request changes.",
    keywords: ["cancellation policy", "reschedule spiritual session"],
  },
};

/** Service detail pages: /services/[slug] */
export const SERVICE_SEO_BY_SLUG: Record<string, PageSeoFallback> = {
  "private-consultations": {
    title: "Private Consultations",
    description:
      "60-minute clairvoyance and channel sessions with Rayana De Silva for clarity, insight, personal guidance, and subtle energetic healing — Zoom, phone, or in person.",
    keywords: [
      "private clairvoyance session",
      "channel consultation",
      "spiritual reading Richmond BC",
    ],
  },
  "wisdom-mentoring": {
    title: "Wisdom Mentoring",
    description:
      "Interactive 60-minute wisdom mentoring with Rayana De Silva for integration, depth, and practical next steps — especially supportive after a private consultation.",
    keywords: [
      "wisdom mentoring session",
      "spiritual integration coaching",
      "post-consultation support",
    ],
  },
  "teachings-courses": {
    title: "Teachings & Courses",
    description:
      "Live Zoom programmes with Rayana De Silva including Experience the Journey Within — structured teachings on alignment, chakras, and energetic literacy in a small group.",
    keywords: [
      "spiritual courses Zoom",
      "Journey Within programme",
      "chakra teachings",
    ],
  },
  "workshops-retreats": {
    title: "Workshops & Retreats",
    description:
      "Immersive workshops and retreats with Rayana De Silva for collective transformation and deep practice — upcoming offerings; contact Heart Matters to stay informed.",
    keywords: ["spiritual retreat BC", "consciousness workshop", "coming soon"],
  },
  "meditation-group-channel": {
    title: "Meditation & Group Channel",
    description:
      "Ongoing meditation practice and group channel membership with Rayana De Silva — deepening presence and awareness in community. Launch details coming soon.",
    keywords: [
      "group meditation channel",
      "spiritual membership",
      "meditation practice online",
    ],
  },
};

/** Seed / example blog posts: /blog/[slug] — used when post has no custom excerpt override needed */
export const BLOG_SEO_BY_SLUG: Record<string, PageSeoFallback> = {
  "courage-to-see": {
    title: "What Your Heart Is Trying to Tell You",
    description:
      "A reflection on listening beneath the noise of everyday life — learning to hear what your heart is trying to tell you, by Rayana De Silva.",
    keywords: ["inner listening", "heart wisdom", "spiritual insight"],
  },
  "inner-listening": {
    title: "The Practice of Inner Listening",
    description:
      "A gentle practice for returning to what is true — stillness, presence, and the art of inner listening with Rayana De Silva.",
    keywords: ["meditation practice", "stillness", "consciousness"],
  },
  "clarity-honesty": {
    title: "Why Clarity Begins with Honesty",
    description:
      "On seeing clearly before trying to change anything — why honesty is the first step toward freedom and integration, from Rayana De Silva.",
    keywords: ["clarity", "self-honesty", "spiritual growth"],
  },
};

function lookupByPath(path: string): PageSeoFallback | undefined {
  if (PAGE_SEO_BY_PATH[path]) {
    return PAGE_SEO_BY_PATH[path];
  }

  const serviceMatch = /^\/services\/([^/]+)$/.exec(path);
  if (serviceMatch) {
    return SERVICE_SEO_BY_SLUG[serviceMatch[1]];
  }

  const blogMatch = /^\/blog\/([^/]+)$/.exec(path);
  if (blogMatch) {
    return BLOG_SEO_BY_SLUG[blogMatch[1]];
  }

  const shopMatch = /^\/shop\/([^/]+)$/.exec(path);
  if (shopMatch) {
    return {
      title: "Shop Offering",
      description:
        "Digital teaching or resource from Rayana De Silva and Heart Matters — support your practice with recorded modules and guided study.",
      keywords: ["Heart Matters digital product", "chakra module"],
    };
  }

  return undefined;
}

export function getPageSeoFallback(path: string): PageSeoFallback | undefined {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return lookupByPath(normalized);
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
