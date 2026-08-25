import "server-only";
import { isDbConfigured } from "@/lib/db/connect";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import {
  RAYANA_ABOUT_SECTIONS,
  RAYANA_FAQS,
  RAYANA_HOME_SECTIONS,
  RAYANA_TESTIMONIALS,
} from "@/lib/data/site-copy";
import type {
  PublicBlogPost,
  PublicFAQ,
  PublicGalleryImage,
  PublicMediaPost,
  PublicPage,
  PublicPricingPlan,
  PublicProduct,
  PublicService,
  PublicSettings,
  PublicTestimonial,
  TypedPageSection,
} from "@/lib/sections/types";
import type { ImageMedia } from "@/models/shared";

function btn(
  label: string,
  href: string,
  variant: "primary" | "secondary" | "ghost" = "primary",
) {
  return { label, href, variant, openInNewTab: false };
}

function section(
  id: string,
  type: string,
  order: number,
  data: Partial<TypedPageSection> = {},
): TypedPageSection {
  return {
    id,
    type,
    label: data.label ?? type,
    enabled: true,
    order,
    eyebrow: "",
    heading: "",
    body: "",
    buttons: [],
    images: [],
    layoutVariant: "default",
    themeVariant: "default",
    items: [],
    settings: {},
    ...data,
  };
}

export const FALLBACK_SETTINGS: PublicSettings = {
  brand: {
    name: "Rayana De Silva — Heart Matters",
    tagline: "Master of Heart Matters · Channeler · Educator",
    headline: "A Deeper Way of Seeing into What Matters",
    footerStatement: "Clarity. Consciousness. Truth. Freedom.",
    logoUrl: "/brand/rayana-de-silva-heart-matters.png",
  },
  contact: {
    email: "rayanadesilva@heartmatters.com",
    displayPhone: "1.604.771.7804",
    e164Phone: "+16047717804",
    whatsApp: "+16047717804",
    location: "Richmond, British Columbia, Canada",
    responseTimeNote:
      "Rayana personally reads every message and responds as thoughtfully as she can within a few business days.",
  },
  social: { facebook: "", instagram: "", youtube: "" },
  header: {
    primaryCtaLabel: "Book a Session",
    primaryCtaHref: "/booking",
    showIntroOnFirstVisit: true,
  },
  footer: {
    newsletterHeading: "Stay Connected",
    newsletterBody:
      "Receive occasional reflections, teachings, and offerings from Rayana.",
    copyrightName: "Rayana De Silva — Heart Matters",
  },
  seo: {
    defaultTitle: "Rayana De Silva — Heart Matters",
    defaultDescription:
      "Private consultations, wisdom mentoring, and teachings for clarity, consciousness, truth, and freedom.",
    defaultOgImage: SEED_IMAGES.portrait1,
  },
  featureFlags: {
    hideShopInNav: true,
    hideMediaInNav: true,
    shopEnabled: false,
    mediaEnabled: false,
  },
  payments: {
    defaultCurrency: "CAD",
  },
};

const HOME_SECTIONS: TypedPageSection[] = RAYANA_HOME_SECTIONS;

function page(
  systemKey: string,
  title: string,
  route: string,
  sections: TypedPageSection[],
  seo: { title: string; description: string },
): PublicPage {
  return {
    title,
    slug: systemKey,
    systemKey,
    route,
    navigationLabel: title,
    showInNavigation: !["privacy", "terms", "disclaimer", "cancellation-policy"].includes(
      systemKey,
    ),
    sections,
    seo,
  };
}

export const FALLBACK_PAGES: Record<string, PublicPage> = {
  home: page("home", "Home", "/", HOME_SECTIONS, {
    title: "Home",
    description: "A Deeper Way of Seeing into What Matters",
  }),
  about: page("about", "About", "/about", RAYANA_ABOUT_SECTIONS, {
    title: "About Rayana De Silva",
    description: "My story, philosophy, and approach to Heart Matters work.",
  }),
  services: page(
    "services",
    "Services",
    "/services",
    [
      section("services-hero", "hero", 0, {
        heading: "Ways to Work with Rayana",
        body: "<p>Private sessions, wisdom teachings, and group experiences—each designed to help you see beneath the surface, understand what is true, and integrate that knowing into your life.</p>",
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("services-private", "splitStory", 1, {
        layoutVariant: "mockup",
      }),
      section("services-teachings", "splitStory", 2, {
        layoutVariant: "mockup",
      }),
      section("services-group", "splitStory", 3, {
        layoutVariant: "mockup",
      }),
      section("services-process", "numberedSteps", 4, {
        eyebrow: "A Journey of Integration",
        heading: "Arrive — Listen — Integrate",
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("services-outcomes", "iconList", 5, {
        eyebrow: "Possibilities Await",
        heading: "What May Open",
        themeVariant: "ivory",
        layoutVariant: "mockup",
      }),
      section("services-paths", "iconList", 6, {
        eyebrow: "Find the Path That Meets You",
        heading: "Which Path Is Calling You?",
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("services-faq", "faqPreview", 7, {
        eyebrow: "Questions You Might Have",
        heading: "Common Questions",
        settings: { limit: 5 },
        themeVariant: "ivory",
        layoutVariant: "mockup",
      }),
      section("services-cta", "bookingCTA", 8, {
        heading: "Your Next Step Can Be Gentle",
        body: "<p>You don't need to have it all figured out. Begin with a single conversation—and let clarity unfold from there.</p>",
        buttons: [btn("Book a Session", "/booking")],
        images: [SEED_IMAGES.sacred],
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
    ],
    { title: "Services", description: "Private consultations and teachings." },
  ),
  pricing: page("pricing", "Pricing", "/pricing", [
    section("pricing-hero", "hero", 0, {
      heading: "Pricing",
      images: [SEED_IMAGES.sacred],
    }),
    section("pricing-intro", "intro", 1, {}),
    section("pricing-spotlight", "pricingSpotlight", 2, {
      settings: { showAll: true },
      images: [SEED_IMAGES.texture],
    }),
    section("pricing-note", "richText", 3, {}),
    section("pricing-cta", "bookingCTA", 4, {
      buttons: [
        btn("Contact Rayana", "/contact"),
        btn("Book a Session", "/booking", "secondary"),
      ],
    }),
  ], { title: "Pricing", description: "Session rates and programmes." }),
  testimonials: page("testimonials", "Testimonials", "/testimonials", [
    section("testimonials-hero", "hero", 0, {
      eyebrow: "Kind Words",
      heading: "From the Heart",
      layoutVariant: "mockup",
    }),
  ], { title: "Testimonials", description: "Client reflections." }),
  faqs: page("faqs", "FAQs", "/faqs", [
    section("faqs-hero", "hero", 0, {
      eyebrow: "Questions You Might Have",
      heading: "Common Questions",
      layoutVariant: "mockup",
    }),
  ], { title: "FAQs", description: "Common questions." }),
  contact: page("contact", "Contact", "/contact", [
    section("contact-hero", "hero", 0, {
      eyebrow: "Reach Out",
      heading: "Get in Touch",
      layoutVariant: "mockup",
    }),
  ], { title: "Contact", description: "Reach out to Rayana." }),
  blog: page("blog", "Journal", "/blog", [
    section("blog-hero", "hero", 0, {
      heading: "Journal",
      images: [SEED_IMAGES.nature],
    }),
    section("blog-intro", "intro", 1, {}),
    section("blog-feature", "mediaFeature", 2, {
      settings: { contentType: "blog", showFeatured: true },
    }),
  ], { title: "Journal", description: "Reflections and teachings." }),
  media: page("media", "Media", "/media", [
    section("media-hero", "hero", 0, {
      heading: "Media",
      images: [SEED_IMAGES.teaching],
    }),
    section("media-feature", "mediaFeature", 1, {
      settings: { contentType: "media", emptyState: true },
    }),
    section("media-newsletter", "newsletter", 2, {}),
  ], { title: "Media", description: "Teachings and conversations." }),
  shop: page("shop", "Shop", "/shop", [
    section("shop-hero", "hero", 0, {
      heading: "Shop",
      images: [SEED_IMAGES.texture],
    }),
    section("shop-intro", "intro", 1, {}),
    section("shop-contact", "contactPanel", 2, {}),
  ], { title: "Shop", description: "Digital offerings." }),
  booking: page("booking", "Book a Session", "/booking", [
    section("booking-hero", "hero", 0, {
      heading: "Book a Session",
      images: [SEED_IMAGES.sacred, SEED_IMAGES.session],
    }),
    section("booking-intro", "intro", 1, {}),
    section("booking-steps", "numberedSteps", 2, {
      items: [
        { title: "Choose a service", body: "Select the offering that fits." },
        { title: "Select a time", body: "Pick from available slots." },
        { title: "Confirm", body: "Complete payment as configured." },
      ],
    }),
    section("booking-faq", "faqPreview", 3, {
      settings: { category: "Booking" },
    }),
  ], { title: "Book a Session", description: "Schedule your session." }),
  "write-a-review": page(
    "write-a-review",
    "Write a Review",
    "/write-a-review",
    [
      section("review-hero", "hero", 0, {
        heading: "Share Your Experience",
        images: [SEED_IMAGES.workshop],
      }),
      section("review-intro", "intro", 1, {}),
      section("review-form", "contactPanel", 2, {
        settings: { showReviewForm: true },
      }),
    ],
    { title: "Write a Review", description: "Share your experience." },
  ),
  privacy: page("privacy", "Privacy Policy", "/privacy", [
    section("privacy-hero", "hero", 0, { heading: "Privacy Policy" }),
    section("privacy-content", "richText", 1, {
      body: "<p><em>This content requires final owner and legal review before launch.</em></p>",
    }),
  ], { title: "Privacy Policy", description: "How we handle your data." }),
  terms: page("terms", "Terms of Use", "/terms", [
    section("terms-hero", "hero", 0, { heading: "Terms of Use" }),
    section("terms-content", "richText", 1, {
      body: "<p><em>This content requires final owner and legal review before launch.</em></p>",
    }),
  ], { title: "Terms of Use", description: "Terms and conditions." }),
  disclaimer: page("disclaimer", "Disclaimer", "/disclaimer", [
    section("disclaimer-hero", "hero", 0, { heading: "Disclaimer" }),
    section("disclaimer-content", "richText", 1, {
      body: "<p>Sessions and educational offerings are provided for personal insight and spiritual exploration.</p>",
    }),
  ], { title: "Disclaimer", description: "Important notices." }),
  "cancellation-policy": page(
    "cancellation-policy",
    "Cancellation Policy",
    "/cancellation-policy",
    [
      section("cancel-hero", "hero", 0, { heading: "Cancellation Policy" }),
      section("cancel-content", "richText", 1, {
        body: "<p><em>This content requires final owner review before launch.</em></p>",
      }),
    ],
    { title: "Cancellation Policy", description: "Booking cancellation terms." },
  ),
};

export const FALLBACK_SERVICES: PublicService[] = [
  {
    title: "Private Consultations",
    slug: "private-consultations",
    shortDescription:
      "Clairvoyance and channel sessions for clarity, insight, personal guidance, and the energetic healing that occurs beneath the surface.",
    mainImage: SEED_IMAGES.portrait1,
    pricePreview: "CAD 220 · First session CAD 170",
    duration: "60 minutes",
    modes: ["Zoom", "FaceTime", "Email", "Phone", "In person"],
    status: "active",
    featured: true,
    displayOrder: 0,
    cardCta: { label: "Learn More", href: "/services/private-consultations" },
    bookable: true,
    standardPrice: 220,
    specialPrice: 170,
    detailPage: {
      hero: {
        heading: "Private Consultations",
        subheading: "Clairvoyance & Channel",
        promise: "Clarity, insight, and guidance beneath the surface of what you are experiencing.",
        chips: ["60 minutes", "CAD 220"],
        image: SEED_IMAGES.portrait1,
      },
      introduction:
        "Centre yourself. Bring your questions. Sit quietly to have your questions answered along with the energetic healing that goes on below the surface of the session.",
      audience: "For those at a crossroads or seeking deeper clarity.",
      explorationTopics: ["Relationships", "Life direction", "Inner patterns"],
      expectations: "Be open to discovering any underlying situation beyond what you are conscious of.",
      process: "We clarify your questions, then Rayana works intuitively and clairvoyantly.",
      benefits: ["Greater clarity", "Deeper understanding", "Practical direction"],
      practicalDetails: "Sessions are 60 minutes; allow 90 minutes in your schedule.",
      gallery: [SEED_IMAGES.session, SEED_IMAGES.sacred, SEED_IMAGES.hands],
      faqs: [],
      relatedServiceSlugs: ["wisdom-mentoring"],
      bookingCta: {
        heading: "Book a private consultation",
        body: "Choose your preferred delivery mode and an available time.",
        buttonLabel: "Book a Session",
      },
      seo: { title: "Private Consultations", description: "Clairvoyance and channel sessions." },
    },
  },
  {
    title: "Wisdom Mentoring",
    slug: "wisdom-mentoring",
    shortDescription:
      "Interactive talk sessions for clarification, depth, and greater understanding—especially after a private session.",
    mainImage: SEED_IMAGES.session,
    pricePreview: "CAD 170",
    duration: "60 minutes",
    modes: ["Zoom", "FaceTime", "Phone", "In person"],
    status: "active",
    featured: true,
    displayOrder: 1,
    cardCta: { label: "Learn More", href: "/services/wisdom-mentoring" },
    bookable: true,
    standardPrice: 170,
    detailPage: {
      hero: {
        heading: "Wisdom Mentoring",
        subheading: "Integration and practical depth",
        promise: "Sessions to give you something to chew on.",
        chips: ["60 minutes", "CAD 170"],
        image: SEED_IMAGES.session,
      },
      introduction:
        "Interactive talk sessions for clarification and more depth—for tweaking what you may already understand and want to experience by taking a deeper dive.",
      audience: "Ideal after a private consultation or when you need focused dialogue.",
      explorationTopics: ["Integration", "Practical next steps", "Life decisions"],
      expectations: "A collaborative, grounded conversation with space for honest exploration.",
      process: "We focus on what is alive for you now—unpacking insight and identifying concrete steps.",
      benefits: ["Practical clarity", "Support integrating insight", "Refined direction"],
      practicalDetails: "60-minute sessions via Zoom, FaceTime, phone, or in person.",
      gallery: [SEED_IMAGES.teaching, SEED_IMAGES.workshop],
      faqs: [],
      relatedServiceSlugs: ["private-consultations"],
      bookingCta: {
        heading: "Book wisdom mentoring",
        body: "Continue the conversation with focused support.",
        buttonLabel: "Book a Session",
      },
      seo: { title: "Wisdom Mentoring", description: "Interactive mentoring for integration." },
    },
  },
  {
    title: "Teachings & Courses",
    slug: "teachings-courses",
    shortDescription:
      "Live interactive programmes through Zoom for those ready to deepen awareness and learn practical energetic systems.",
    mainImage: SEED_IMAGES.teaching,
    pricePreview: "From CAD 600",
    duration: "Programme-based",
    modes: ["Zoom"],
    status: "active",
    featured: true,
    displayOrder: 2,
    cardCta: { label: "Learn More", href: "/services/teachings-courses" },
    bookable: false,
    detailPage: {
      hero: {
        heading: "Teachings & Courses",
        subheading: "Experience the Journey Within",
        promise: "Structured teachings for alignment, energetic literacy, and inner knowing.",
        chips: ["Live on Zoom", "Level 1 & Level 2"],
        image: SEED_IMAGES.teaching,
      },
      introduction:
        "Experience The Journey Within—live and interactive over Zoom, class size limited to 10 participants.",
      audience: "Those committed to regular practice and group learning.",
      explorationTopics: ["Chakras", "Alignment", "Energetic literacy"],
      expectations: "Live, interactive classes with practical exercises.",
      process: "12 sessions over 12 weeks at 2 hours per week.",
      benefits: ["Structured education", "Safe group container", "Practical daily tools"],
      practicalDetails: "See Pricing for Level 1 and Level 2 details.",
      gallery: [SEED_IMAGES.teaching, SEED_IMAGES.workshop],
      faqs: [],
      relatedServiceSlugs: ["private-consultations"],
      bookingCta: {
        heading: "Enquire about programmes",
        body: "Contact Rayana to learn about upcoming cohorts.",
        buttonLabel: "Contact",
      },
      seo: { title: "Teachings & Courses", description: "Live Zoom programmes." },
    },
  },
  {
    title: "Workshops & Retreats",
    slug: "workshops-retreats",
    shortDescription: "Immersive transformation experiences—coming soon.",
    mainImage: SEED_IMAGES.workshop,
    pricePreview: "TBA",
    duration: "Immersive",
    modes: ["In person"],
    status: "coming_soon",
    featured: false,
    displayOrder: 3,
    cardCta: { label: "Learn More", href: "/services/workshops-retreats" },
    bookable: false,
    detailPage: {
      hero: {
        heading: "Workshops & Retreats",
        subheading: "Immersive transformation",
        promise: "Location TBA.",
        chips: ["Coming soon"],
        image: SEED_IMAGES.workshop,
      },
      introduction: "Immersive workshops and retreats for collective deep work.",
      audience: "Those drawn to collective transformation.",
      explorationTopics: ["Immersive practice", "Group channel", "Presence"],
      expectations: "Details forthcoming.",
      process: "To be announced.",
      benefits: ["Collective depth", "Renewed presence"],
      practicalDetails: "Location and pricing TBA.",
      gallery: [SEED_IMAGES.workshop, SEED_IMAGES.nature],
      faqs: [],
      relatedServiceSlugs: ["teachings-courses"],
      bookingCta: {
        heading: "Stay informed",
        body: "Workshops and retreats are coming soon.",
        buttonLabel: "Contact",
      },
      seo: { title: "Workshops & Retreats", description: "Coming soon." },
    },
  },
  {
    title: "Meditation Practice & Group Channel",
    slug: "meditation-group-channel",
    shortDescription:
      "Membership-based group channel for deepening inner awareness and cultivating presence—coming soon.",
    mainImage: SEED_IMAGES.sacred,
    pricePreview: "Coming soon",
    duration: "Ongoing membership",
    modes: ["Online"],
    status: "coming_soon",
    featured: false,
    displayOrder: 4,
    cardCta: { label: "Learn More", href: "/services/meditation-group-channel" },
    bookable: false,
    detailPage: {
      hero: {
        heading: "Meditation Practice & Group Channel",
        subheading: "Deepening presence together",
        promise: "Membership channel—coming soon.",
        chips: ["Coming soon"],
        image: SEED_IMAGES.sacred,
      },
      introduction: "A Patreon-style membership channel for ongoing meditation practice and group presence.",
      audience: "Practitioners wanting regular support and community.",
      explorationTopics: ["Meditation", "Presence", "Group channel"],
      expectations: "Details forthcoming.",
      process: "To be announced.",
      benefits: ["Ongoing practice support", "Community container"],
      practicalDetails: "Launch date and pricing to be announced.",
      gallery: [SEED_IMAGES.sacred, SEED_IMAGES.texture],
      faqs: [],
      relatedServiceSlugs: ["teachings-courses"],
      bookingCta: {
        heading: "Coming soon",
        body: "Join the newsletter to be notified at launch.",
        buttonLabel: "Stay Connected",
      },
      seo: { title: "Meditation & Group Channel", description: "Coming soon." },
    },
  },
];

export const FALLBACK_TESTIMONIALS: PublicTestimonial[] = RAYANA_TESTIMONIALS;

export const FALLBACK_FAQS: PublicFAQ[] = RAYANA_FAQS;

export const FALLBACK_PRICING: PublicPricingPlan[] = [
  {
    title: "Private Consultation",
    slug: "private-consultation",
    description: "Clairvoyance & channel session",
    features: ["60 minutes", "Zoom, FaceTime, phone, email, or in person"],
    price: 220,
    currency: "CAD",
    availability: "active",
    featured: false,
    ctaLabel: "Book a Session",
    ctaHref: "/booking",
  },
  {
    title: "First Private Session Special",
    slug: "first-session-special",
    description: "Introductory rate for your first private consultation",
    features: ["60 minutes", "One-time introductory offer when active"],
    price: 220,
    salePrice: 170,
    currency: "CAD",
    badge: "Special offer",
    availability: "active",
    ctaLabel: "Book a Session",
    ctaHref: "/booking",
    featured: true,
  },
  {
    title: "Wisdom Mentoring",
    slug: "wisdom-mentoring-session",
    description: "Interactive integration and depth session",
    features: ["60 minutes", "Ideal after a private session"],
    price: 170,
    currency: "CAD",
    availability: "active",
    featured: false,
    ctaLabel: "Book a Session",
    ctaHref: "/booking",
  },
  {
    title: "The Deepening",
    slug: "the-deepening",
    description:
      "Three months dedicated evolution—see, feel, sense, understand, embody.",
    features: [
      "3 private sessions",
      "4 wisdom mentoring sessions",
      "Integration practices between sessions",
      "Limited between-session support",
      "Personalised direction and focus",
    ],
    price: 2400,
    salePrice: 1800,
    currency: "CAD",
    badge: "Founding client rate available",
    availability: "active",
    ctaLabel: "Enquire & Book",
    ctaHref: "/contact",
    image: SEED_IMAGES.sacred,
    featured: true,
  },
  {
    title: "Experience the Journey Within — Level 1",
    slug: "journey-within-level-1",
    description: "12 sessions over 12 weeks · 2 hours per week · class size limited to 10",
    features: [
      "Alignment and chakras 1–7",
      "Charging energetic systems with intention",
      "Learning to read oneself",
    ],
    price: 600,
    currency: "CAD",
    availability: "active",
    featured: false,
    ctaLabel: "Enquire",
    ctaHref: "/contact",
    image: SEED_IMAGES.teaching,
  },
  {
    title: "Experience the Journey Within — Level 2",
    slug: "journey-within-level-2",
    description: "Prerequisite: Level 1 · 12 sessions over 12 weeks · 2 hours per week",
    features: [
      "Out-of-body chakras 8–12",
      "Beginning to read others",
      "Clairvoyance, clairsentience, clairaudience, and discernment",
    ],
    price: 600,
    currency: "CAD",
    availability: "active",
    featured: false,
    ctaLabel: "Enquire",
    ctaHref: "/contact",
    image: SEED_IMAGES.workshop,
  },
];

export const FALLBACK_BLOG: PublicBlogPost[] = [
  {
    title: "What Your Heart Is Trying to Tell You",
    slug: "courage-to-see",
    excerpt: "Learning to listen beneath the noise of everyday life.",
    body: "<p>There comes a moment when the old story no longer fits. What matters then is not escape, but the courage to see what is true.</p>",
    heroImage: SEED_IMAGES.sacred,
    author: "Rayana De Silva",
    categories: ["Insight"],
    readingTimeMinutes: 5,
    seo: {},
  },
  {
    title: "The Practice of Inner Listening",
    slug: "inner-listening",
    excerpt: "A gentle practice for returning to what is true.",
    body: "<p>Stillness is not emptiness—it is the space in which the heart can speak.</p>",
    heroImage: SEED_IMAGES.teaching,
    author: "Rayana De Silva",
    categories: ["Practice"],
    readingTimeMinutes: 4,
    seo: {},
  },
  {
    title: "Why Clarity Begins with Honesty",
    slug: "clarity-honesty",
    excerpt: "On seeing clearly before trying to change anything.",
    body: "<p>We cannot integrate what we refuse to see. Honesty is the first movement toward freedom.</p>",
    heroImage: SEED_IMAGES.workshop,
    author: "Rayana De Silva",
    categories: ["Teaching"],
    readingTimeMinutes: 6,
    seo: {},
  },
];

export const FALLBACK_GALLERY: PublicGalleryImage[] = Object.entries(SEED_IMAGES).map(
  ([key, image]) => ({
    title: key.replace(/([A-Z])/g, " $1").trim(),
    slug: key,
    categorySlug: "editorial",
    image,
  }),
);

async function withDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    const { connectDB } = await import("@/lib/db/connect");
    await connectDB();
    return await fn();
  } catch {
    return fallback;
  }
}

function lean<T>(doc: T | null | undefined): T | null {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc)) as T;
}

function mapMediaPost(doc: unknown): PublicMediaPost {
  const item = doc as unknown as Record<string, unknown>;
  return {
    title: String(item.title ?? ""),
    slug: String(item.slug ?? ""),
    excerpt: String(item.excerpt ?? ""),
    type: String(item.type ?? ""),
    thumbnail: item.thumbnail as ImageMedia | undefined,
    publishedAt: item.publishedAt
      ? new Date(item.publishedAt as string).toISOString()
      : undefined,
  };
}

function mapProduct(doc: unknown): PublicProduct {
  const item = doc as unknown as Record<string, unknown>;
  const gallery = item.gallery as ImageMedia[] | undefined;
  return {
    title: String(item.name ?? item.title ?? ""),
    slug: String(item.slug ?? ""),
    shortDescription: String(item.summary ?? item.shortDescription ?? ""),
    price: Number(item.price ?? 0),
    currency: String(item.currency ?? "CAD"),
    image: gallery?.[0],
    status: String(item.visibility ?? item.status ?? "published"),
  };
}

export async function getPublicSettings(): Promise<PublicSettings> {
  return withDb(async () => {
    const { SiteSettings } = await import("@/models");
    const doc = await SiteSettings.findOne({ singletonKey: "default" }).lean();
    return (lean(doc) as PublicSettings | null) ?? FALLBACK_SETTINGS;
  }, FALLBACK_SETTINGS);
}

export async function getPublicPage(systemKey: string): Promise<PublicPage | null> {
  const fallback = FALLBACK_PAGES[systemKey] ?? null;
  return withDb(async () => {
    const { Page } = await import("@/models");
    const doc = await Page.findOne({ systemKey, status: "published" }).lean();
    if (!doc) return fallback;
    return lean(doc) as PublicPage;
  }, fallback);
}

export async function getPublicPages(): Promise<PublicPage[]> {
  return withDb(async () => {
    const { Page } = await import("@/models");
    const docs = await Page.find({ status: "published" })
      .sort({ route: 1 })
      .lean();
    return docs.map((d) => lean(d) as PublicPage);
  }, Object.values(FALLBACK_PAGES));
}

export async function getPublicServices(): Promise<PublicService[]> {
  return withDb(async () => {
    const { Service } = await import("@/models");
    const docs = await Service.find({ status: { $ne: "archived" } })
      .sort({ displayOrder: 1 })
      .lean();
    return docs.map((d) => lean(d) as PublicService);
  }, FALLBACK_SERVICES);
}

export async function getPublicService(slug: string): Promise<PublicService | null> {
  const fallback =
    FALLBACK_SERVICES.find((s) => s.slug === slug) ?? null;
  return withDb(async () => {
    const { Service } = await import("@/models");
    const doc = await Service.findOne({ slug, status: { $ne: "archived" } }).lean();
    if (!doc) return fallback;
    return lean(doc) as PublicService;
  }, fallback);
}

export async function getPublicTestimonials(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<PublicTestimonial[]> {
  const { featuredOnly, limit } = options ?? {};
  let fallback = FALLBACK_TESTIMONIALS;
  if (featuredOnly) fallback = fallback.filter((t) => t.featured);
  if (limit) fallback = fallback.slice(0, limit);

  return withDb(async () => {
    const { Testimonial } = await import("@/models");
    const query: Record<string, unknown> = { status: "approved" };
    if (featuredOnly) query.featured = true;
    let q = Testimonial.find(query).sort({ displayOrder: 1 });
    if (limit) q = q.limit(limit);
    const docs = await q.lean();
    return docs.map((d) => lean(d) as PublicTestimonial);
  }, fallback);
}

export async function getPublicFaqs(category?: string): Promise<PublicFAQ[]> {
  let fallback = FALLBACK_FAQS;
  if (category) fallback = fallback.filter((f) => f.category === category);

  return withDb(async () => {
    const { FAQ } = await import("@/models");
    const query: Record<string, unknown> = { status: "published" };
    if (category) query.category = category;
    const docs = await FAQ.find(query).sort({ displayOrder: 1 }).lean();
    return docs.map((d) => lean(d) as PublicFAQ);
  }, fallback);
}

export async function getPublicPricingPlans(options?: {
  featuredOnly?: boolean;
  slug?: string;
}): Promise<PublicPricingPlan[]> {
  const { featuredOnly, slug } = options ?? {};
  let fallback = FALLBACK_PRICING;
  if (slug) fallback = fallback.filter((p) => p.slug === slug);
  if (featuredOnly) fallback = fallback.filter((p) => p.featured);

  return withDb(async () => {
    const { PricingPlan } = await import("@/models");
    const query: Record<string, unknown> = {
      availability: { $ne: "archived" },
    };
    if (slug) query.slug = slug;
    if (featuredOnly) query.featured = true;
    const docs = await PricingPlan.find(query).sort({ displayOrder: 1 }).lean();
    return docs.map((d) => lean(d) as PublicPricingPlan);
  }, fallback);
}

export async function getPublicBlogPosts(limit?: number): Promise<PublicBlogPost[]> {
  let fallback = FALLBACK_BLOG;
  if (limit) fallback = fallback.slice(0, limit);

  return withDb(async () => {
    const { BlogPost } = await import("@/models");
    let q = BlogPost.find({ status: "published" }).sort({ publishedAt: -1 });
    if (limit) q = q.limit(limit);
    const docs = await q.lean();
    return docs.map((d) => lean(d) as PublicBlogPost);
  }, fallback);
}

export async function getPublicBlogPost(slug: string): Promise<PublicBlogPost | null> {
  const fallback = FALLBACK_BLOG.find((p) => p.slug === slug) ?? null;
  return withDb(async () => {
    const { BlogPost } = await import("@/models");
    const doc = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (!doc) return fallback;
    return lean(doc) as PublicBlogPost;
  }, fallback);
}

export async function getPublicGalleryImages(): Promise<PublicGalleryImage[]> {
  return withDb(async () => {
    const { GalleryImage } = await import("@/models");
    const docs = await GalleryImage.find({ status: "published" })
      .sort({ displayOrder: 1 })
      .lean();
    return docs.map((d) => lean(d) as PublicGalleryImage);
  }, FALLBACK_GALLERY);
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  return withDb(async () => {
    const { Product } = await import("@/models");
    const docs = await Product.find({ visibility: "published" })
      .sort({ displayOrder: 1 })
      .lean();
    return docs.map((d) => mapProduct(lean(d)));
  }, []);
}

export async function getPublicProduct(slug: string): Promise<PublicProduct | null> {
  return withDb(async () => {
    const { Product } = await import("@/models");
    const doc = await Product.findOne({ slug, visibility: "published" }).lean();
    if (!doc) return null;
    return mapProduct(lean(doc));
  }, null);
}

export async function getPublicMediaPosts(limit?: number): Promise<PublicMediaPost[]> {
  return withDb(async () => {
    const { MediaPost } = await import("@/models");
    let q = MediaPost.find({ status: "published" }).sort({ publishedAt: -1 });
    if (limit) q = q.limit(limit);
    const docs = await q.lean();
    return docs.map((d) => mapMediaPost(lean(d)));
  }, []);
}

export { defaultImage } from "@/lib/data/seed-images";
