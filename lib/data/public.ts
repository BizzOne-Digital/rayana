import "server-only";
import { isDbConfigured } from "@/lib/db/connect";
import { SEED_IMAGES } from "@/lib/data/seed-images";
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

const HOME_SECTIONS: TypedPageSection[] = [
  section("home-hero", "hero", 0, {
    heading: "A Deeper Way of Seeing What Matters",
    body: "<p>See beneath the surface. Understand the pattern.<br/>Live with greater clarity.</p>",
    buttons: [
      btn("Explore the Work", "/services"),
      btn("Meet Rayana", "/about", "secondary"),
    ],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-welcome", "splitStory", 1, {
    eyebrow: "Welcome",
    heading: "Return to the Wisdom of Your Heart",
    body: "<p>Rayana De Silva is a master of heart matters—channeler, educator, and guide for those ready to see beneath the surface of their lives. Through private sessions, teachings, and group experiences, she helps you return to the wisdom already alive within you.</p>",
    images: [SEED_IMAGES.portrait2],
    buttons: [btn("Learn More About Rayana", "/about", "secondary")],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-offerings", "serviceShowcase", 2, {
    eyebrow: "Ways to Work Together",
    heading: "Signature Offerings",
    settings: { limit: 3, featuredOnly: true },
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-heart", "editorialQuote", 3, {
    heading: "The Heart Remembers",
    body: "<p>Beneath the stories we tell ourselves lives a deeper knowing—quiet, steady, and true. Rayana's work invites you back to that place: where clarity is not forced, but remembered.</p>",
    images: [SEED_IMAGES.hands],
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-testimonials", "testimonialSlider", 4, {
    eyebrow: "Kind Words",
    heading: "From the Heart",
    settings: { featuredOnly: true, limit: 6 },
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
  section("home-insights", "mediaFeature", 5, {
    eyebrow: "Insights & Teachings",
    heading: "Guidance for Your Journey",
    settings: { contentType: "blog", limit: 3 },
    themeVariant: "ivory",
    layoutVariant: "mockup",
  }),
  section("home-cta", "bookingCTA", 6, {
    heading: "Begin Where You Are",
    body: "<p>The next step is already within you. I'm here to walk beside you as you return to what matters most.</p>",
    buttons: [btn("Book a Session", "/booking")],
    images: [SEED_IMAGES.sacred],
    themeVariant: "burgundy",
    layoutVariant: "mockup",
  }),
];

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
  about: page(
    "about",
    "About",
    "/about",
    [
      section("about-hero", "hero", 0, {
        eyebrow: "About Rayana",
        heading: "The Woman Behind Heart Matters",
        body: "<p>My story. My purpose. The path that became Heart Matters.</p>",
        images: [SEED_IMAGES.portrait2],
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("about-intro", "splitStory", 1, {
        heading: "A Life Shaped by Listening",
        body: "<p>From an early age, I sensed that life held deeper layers than what appeared on the surface. That sensitivity became a path—a lifelong devotion to listening, seeing, and guiding others back to the wisdom of their own hearts.</p><p>Over decades of study, practice, and service, I have learned that transformation does not come from fixing ourselves. It comes from seeing clearly, understanding deeply, and choosing to live from what is true.</p>",
        images: [SEED_IMAGES.portrait1],
        themeVariant: "ivory",
        layoutVariant: "mockup",
      }),
      section("about-journey", "numberedSteps", 2, {
        heading: "The Journey",
        items: [
          {
            title: "The Calling",
            body: "An inner pull to help others see beneath the surface—to listen where others only heard noise, and to guide people back to their own knowing.",
          },
          {
            title: "The Opening",
            body: "Years of study, practice, and deep inner work opened a path of clarity. What began as personal seeking became a vocation of service.",
          },
          {
            title: "The Work",
            body: "Heart Matters was born—a container for private sessions, teachings, and group experiences that honour truth, presence, and integration.",
          },
        ],
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("about-principles", "iconList", 3, {
        eyebrow: "Core Principles",
        heading: "See Clearly. Live Deeply.",
        items: [
          {
            title: "Clarity",
            body: "Making choices that honour what is true—not what is convenient, familiar, or expected.",
            icon: "heart",
          },
          {
            title: "Alignment",
            body: "Releasing what is out of sync with your deeper values so your life reflects your inner knowing.",
            icon: "orbit",
          },
          {
            title: "Embodiment",
            body: "Living the insights—not just understanding them intellectually, but integrating them into daily life.",
            icon: "flame",
          },
        ],
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("about-teaching", "splitStory", 4, {
        heading: "Wisdom Becomes Real When It Is Lived",
        body: "<p>My teachings are not abstract philosophy—they are invitations to practice, integrate, and embody. Whether in private sessions, written reflections, or group circles, the aim is the same: to help you return to your own knowing.</p>",
        images: [SEED_IMAGES.workshop],
        buttons: [btn("Explore My Teachings", "/blog", "secondary")],
        themeVariant: "ivory",
        layoutVariant: "mockup",
      }),
      section("about-values", "iconList", 5, {
        heading: "What I Value Most",
        items: [
          {
            title: "Presence",
            body: "Showing up fully—with attention, patience, and respect for what is unfolding.",
          },
          {
            title: "Truth",
            body: "Creating a space where honesty is safe, and clarity can emerge without force.",
          },
          {
            title: "Compassion",
            body: "Meeting each person where they are—with warmth, depth, and without judgment.",
          },
          {
            title: "Integration",
            body: "Supporting you to carry insight into your relationships, choices, and daily life.",
          },
        ],
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("about-behind", "galleryStrip", 6, {
        heading: "Behind the Work",
        themeVariant: "ivory",
        layoutVariant: "mockup",
      }),
      section("about-quote", "editorialQuote", 7, {
        heading: "Teacher. Guide. Mirror for Your Soul.",
        body: "<p>“You don't have to become someone new. You just have to return to who you've always been. The heart knows the way.”</p>",
        themeVariant: "burgundy",
        layoutVariant: "mockup",
      }),
      section("about-cta", "bookingCTA", 8, {
        heading: "Let's Begin With What Matters",
        body: "<p>Your heart already has the answers. Let's uncover them—together.</p>",
        buttons: [btn("Book a Session", "/booking")],
        themeVariant: "ivory",
        layoutVariant: "mockup",
      }),
    ],
    { title: "About Rayana De Silva", description: "My story and approach." },
  ),
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
    title: "Private Sessions",
    slug: "private-consultation",
    shortDescription:
      "A focused session for clarity on what matters most in your life right now.",
    mainImage: SEED_IMAGES.session,
    pricePreview: "From $350 CAD",
    duration: "90 minutes",
    modes: ["In person", "Video"],
    status: "active",
    featured: true,
    displayOrder: 0,
    cardCta: { label: "Learn More", href: "/services/private-consultation" },
    bookable: true,
    standardPrice: 350,
    detailPage: {
      hero: {
        heading: "Private Consultation",
        subheading: "Clarity for what matters now",
        promise: "See beneath the surface with presence and depth.",
        chips: ["90 minutes", "In person or video"],
        image: SEED_IMAGES.session,
      },
      introduction:
        "A private consultation offers focused time to explore what is unfolding in your life.",
      audience: "For those at a crossroads or seeking deeper clarity.",
      explorationTopics: ["Relationships", "Life direction", "Inner patterns"],
      expectations: "Arrive open; leave with clearer seeing.",
      process: "We begin with what is present and follow the thread of truth.",
      benefits: ["Greater clarity", "Deeper self-understanding", "Practical direction"],
      practicalDetails: "Sessions available by appointment in Vancouver or via video.",
      gallery: [SEED_IMAGES.session, SEED_IMAGES.sacred, SEED_IMAGES.hands],
      faqs: [],
      relatedServiceSlugs: ["wisdom-mentoring"],
      bookingCta: {
        heading: "Ready to begin?",
        body: "Book your private consultation when you feel called.",
        buttonLabel: "Book a Session",
      },
      seo: {
        title: "Private Consultation",
        description: "Focused session for clarity and depth.",
      },
    },
  },
  {
    title: "Heart Matters Teachings",
    slug: "wisdom-mentoring",
    shortDescription: "Ongoing guidance for sustained transformation and integration.",
    mainImage: SEED_IMAGES.teaching,
    pricePreview: "From $275 CAD",
    duration: "60 minutes",
    modes: ["Video"],
    status: "active",
    featured: true,
    displayOrder: 1,
    cardCta: { label: "Learn More", href: "/services/wisdom-mentoring" },
    bookable: true,
    standardPrice: 275,
    detailPage: {
      hero: {
        heading: "Wisdom Mentoring",
        subheading: "Sustained guidance",
        promise: "Walk the path of integration with ongoing support.",
        chips: ["60 minutes", "Video"],
        image: SEED_IMAGES.teaching,
      },
      introduction: "Mentoring supports you through seasons of change and growth.",
      audience: "For those committed to ongoing inner work.",
      explorationTopics: ["Integration", "Consciousness", "Sovereignty"],
      expectations: "Regular sessions with practical homework between.",
      process: "We track patterns and celebrate breakthroughs together.",
      benefits: ["Sustained support", "Deeper integration", "Living from truth"],
      practicalDetails: "Monthly or bi-weekly sessions by arrangement.",
      gallery: [SEED_IMAGES.teaching, SEED_IMAGES.workshop, SEED_IMAGES.nature],
      faqs: [],
      relatedServiceSlugs: ["private-consultation"],
      bookingCta: {
        heading: "Begin mentoring",
        body: "Explore whether ongoing guidance is right for you.",
        buttonLabel: "Book a Session",
      },
      seo: { title: "Wisdom Mentoring", description: "Ongoing guidance." },
    },
  },
  {
    title: "Group Experiences",
    slug: "group-experiences",
    shortDescription:
      "Shared circles and workshops for collective healing, presence, and heart-centred learning.",
    mainImage: SEED_IMAGES.workshop,
    pricePreview: "Enquire",
    duration: "Varies",
    modes: ["In person"],
    status: "active",
    featured: true,
    displayOrder: 2,
    cardCta: { label: "Learn More", href: "/services" },
    bookable: false,
    detailPage: {
      hero: {
        heading: "Group Experiences",
        subheading: "Shared presence",
        promise: "Gather in circle for teachings and collective insight.",
        chips: ["Workshops", "Circles"],
        image: SEED_IMAGES.workshop,
      },
      introduction: "Group experiences offer a container for shared learning.",
      audience: "For those drawn to community and collective wisdom.",
      explorationTopics: ["Presence", "Shared insight", "Integration"],
      expectations: "Arrive open to connection.",
      process: "We gather, reflect, and integrate together.",
      benefits: ["Community", "Shared wisdom", "Deepening practice"],
      practicalDetails: "See upcoming offerings on the services page.",
      gallery: [SEED_IMAGES.workshop, SEED_IMAGES.nature],
      faqs: [],
      relatedServiceSlugs: ["private-consultation"],
      bookingCta: {
        heading: "Join a circle",
        body: "Enquire about upcoming group experiences.",
        buttonLabel: "Contact Rayana",
      },
      seo: { title: "Group Experiences", description: "Workshops and circles." },
    },
  },
];

export const FALLBACK_TESTIMONIALS: PublicTestimonial[] = [
  {
    slug: "anita-r",
    name: "Anita R.",
    quote:
      "Rayana helped me see what I could not see alone. Her presence is gentle, precise, and deeply transformative.",
    excerpt: "Her presence is gentle, precise, and deeply transformative.",
    featured: true,
    showFullName: true,
    role: "Vancouver, BC",
  },
  {
    slug: "david-m",
    name: "David M.",
    quote:
      "Working with Rayana brought clarity to patterns I had carried for years. I finally understand what my heart was asking for.",
    excerpt: "Clarity to patterns I had carried for years.",
    featured: true,
    showFullName: true,
    role: "Toronto, ON",
  },
  {
    slug: "sarah-l",
    name: "Sarah L.",
    quote:
      "The teachings opened a doorway I didn't know existed. I feel more present, more honest, and more free.",
    excerpt: "More present, more honest, and more free.",
    featured: true,
    showFullName: true,
    role: "Calgary, AB",
  },
];

export const FALLBACK_FAQS: PublicFAQ[] = [
  {
    slug: "how-to-book",
    question: "How do I book a session?",
    answer:
      "Visit the booking page, choose your service and preferred time, and complete the confirmation steps. You'll receive a confirmation email with all the details.",
    category: "Booking",
  },
  {
    slug: "session-format",
    question: "Are sessions in person or online?",
    answer:
      "Both options are available depending on the service. Private sessions can be held in person in Vancouver or via secure video.",
    category: "General",
  },
  {
    slug: "which-service",
    question: "How do I know which offering is right for me?",
    answer:
      "If you're unsure, begin with a private session. Rayana will help you discern the path that meets you where you are.",
    category: "General",
  },
  {
    slug: "session-length",
    question: "How long are sessions?",
    answer:
      "Private sessions are typically 90 minutes. Mentoring and group experiences vary—details are listed on each service page.",
    category: "Sessions",
  },
  {
    slug: "cancellation",
    question: "What is your cancellation policy?",
    answer:
      "Please provide at least 48 hours notice if you need to reschedule or cancel. See the cancellation policy page for full details.",
    category: "Booking",
  },
];

export const FALLBACK_PRICING: PublicPricingPlan[] = [
  {
    title: "The Deepening",
    slug: "the-deepening",
    description:
      "Three months of dedicated evolution—private sessions, mentoring, and integration practices.",
    features: [
      "Monthly private sessions",
      "Wisdom mentoring calls",
      "Integration practices",
      "Personalised direction",
    ],
    price: 4200,
    currency: "CAD",
    badge: "Signature Programme",
    availability: "active",
    ctaLabel: "Enquire",
    ctaHref: "/contact",
    image: SEED_IMAGES.sacred,
    featured: true,
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
