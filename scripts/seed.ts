/**
 * Idempotent database seed for Rayana De Silva — Heart Matters.
 * Run: npm run seed
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose-connect";
import {
  AdminUser,
  AvailabilityRule,
  BlogPost,
  FAQ,
  GalleryCategory,
  GalleryImage,
  Page,
  PricingPlan,
  Service,
  SiteSettings,
  Testimonial,
  type ImageMedia,
  type PageSection,
} from "@/models";

function loadEnvFile(filename: string): void {
  const filePath = resolve(process.cwd(), filename);
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const raw = trimmed.slice(eq + 1).trim();
    const value = raw.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

function log(message: string): void {
  console.log(`[seed] ${message}`);
}

function img(
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

const IMAGES = {
  portrait1: img("portrait-1.svg", "Editorial portrait placeholder in warm burgundy tones"),
  portrait2: img("portrait-2.svg", "Secondary portrait composition with golden accent line"),
  hands: img("hands-detail.svg", "Close detail of hands in warm light"),
  landscape: img("landscape.svg", "Coastal landscape at dusk with golden horizon"),
  session: img("session-atmosphere.svg", "Quiet session space with soft ambient light"),
  texture: img("texture-abstract.svg", "Velvet texture with abstract golden thread", { decorative: true }),
  sacred: img("sacred-space.svg", "Sacred space with gentle luminous centre"),
  teaching: img("teaching.svg", "Teaching atmosphere with layered parchment tones"),
  workshop: img("workshop.svg", "Gathered circle suggesting workshop presence"),
  nature: img("nature.svg", "Forest path through mist and morning light"),
};

function btn(label: string, href: string, variant: "primary" | "secondary" | "ghost" = "primary") {
  return { label, href, variant, openInNewTab: false };
}

function section(
  id: string,
  type: string,
  order: number,
  data: Partial<PageSection> = {},
): PageSection {
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

const SPIRITUAL_DISCLAIMER =
  "Sessions and educational offerings are provided for personal insight, spiritual exploration, and general wellbeing. They are not medical, psychological, legal, or financial treatment or advice, and they do not diagnose, treat, or cure any condition. Please consult an appropriately licensed professional for those needs. Clients remain responsible for their own decisions.";

async function upsertSiteSettings(): Promise<void> {
  log("Upserting site settings…");
  await SiteSettings.findOneAndUpdate(
    { singletonKey: "default" },
    {
      singletonKey: "default",
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
        defaultOgImage: IMAGES.portrait1,
      },
      booking: {
        hostTimeZone: "America/Vancouver",
        rescheduleNoticeHours: 24,
        holdDurationMinutes: 15,
        eTransferInstructions:
          "E-transfer instructions can be configured in admin settings before launch.",
      },
      payments: {
        defaultCurrency: "CAD",
        stripeEnabled: false,
        eTransferEnabled: true,
      },
      email: {
        fromName: "Rayana De Silva — Heart Matters",
        replyTo: "rayanadesilva@heartmatters.com",
      },
      featureFlags: {
        hideShopInNav: true,
        hideMediaInNav: true,
        shopEnabled: false,
        mediaEnabled: false,
      },
      legalNotices: {
        requiresOwnerReview: true,
        disclaimerSummary: SPIRITUAL_DISCLAIMER,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

async function upsertAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
  }

  log(`Upserting admin user for ${email}…`);
  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name: "Rayana De Silva",
      email: email.toLowerCase(),
      passwordHash,
      role: "super_admin",
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

interface PageSeedData {
  systemKey: string;
  title: string;
  slug: string;
  route: string;
  navigationLabel: string;
  showInNavigation?: boolean;
  sections: PageSection[];
  seo: { title: string; description: string };
}

function buildPages(): PageSeedData[] {
  const homeSections: PageSection[] = [
    section("home-hero", "hero", 0, {
      label: "Home Hero",
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
      label: "Welcome",
      eyebrow: "Welcome",
      heading: "Return to the Wisdom of Your Heart",
      body: "<p>Rayana De Silva is a master of heart matters—channeler, educator, and guide for those ready to see beneath the surface of their lives. Through private sessions, teachings, and group experiences, she helps you return to the wisdom already alive within you.</p>",
      images: [IMAGES.portrait2],
      buttons: [btn("Learn More About Rayana", "/about", "secondary")],
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("home-offerings", "serviceShowcase", 2, {
      label: "Signature Offerings",
      eyebrow: "Ways to Work Together",
      heading: "Signature Offerings",
      settings: { limit: 3, featuredOnly: true },
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("home-heart", "editorialQuote", 3, {
      label: "The Heart Remembers",
      heading: "The Heart Remembers",
      body: "<p>Beneath the stories we tell ourselves lives a deeper knowing—quiet, steady, and true. Rayana's work invites you back to that place: where clarity is not forced, but remembered.</p>",
      images: [IMAGES.hands],
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("home-testimonials", "testimonialSlider", 4, {
      label: "Testimonials",
      eyebrow: "Kind Words",
      heading: "From the Heart",
      settings: { featuredOnly: true, limit: 6 },
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("home-insights", "mediaFeature", 5, {
      label: "Insights",
      eyebrow: "Insights & Teachings",
      heading: "Guidance for Your Journey",
      settings: { contentType: "blog", limit: 3 },
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("home-cta", "bookingCTA", 6, {
      label: "Final CTA",
      heading: "Begin Where You Are",
      body: "<p>The next step is already within you. I'm here to walk beside you as you return to what matters most.</p>",
      buttons: [btn("Book a Session", "/booking")],
      images: [IMAGES.sacred],
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
  ];

  const aboutSections: PageSection[] = [
    section("about-hero", "hero", 0, {
      label: "About Hero",
      eyebrow: "About Rayana",
      heading: "The Woman Behind Heart Matters",
      body: "<p>My story. My purpose. The path that became Heart Matters.</p>",
      images: [IMAGES.portrait2],
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("about-intro", "splitStory", 1, {
      label: "Intro",
      heading: "A Life Shaped by Listening",
      body: "<p>From an early age, I sensed that life held deeper layers than what appeared on the surface. That sensitivity became a path—a lifelong devotion to listening, seeing, and guiding others back to the wisdom of their own hearts.</p><p>Over decades of study, practice, and service, I have learned that transformation does not come from fixing ourselves. It comes from seeing clearly, understanding deeply, and choosing to live from what is true.</p>",
      images: [IMAGES.portrait1],
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("about-journey", "numberedSteps", 2, {
      label: "The Journey",
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
      label: "Principles",
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
      label: "Teaching",
      heading: "Wisdom Becomes Real When It Is Lived",
      body: "<p>My teachings are not abstract philosophy—they are invitations to practice, integrate, and embody. Whether in private sessions, written reflections, or group circles, the aim is the same: to help you return to your own knowing.</p>",
      images: [IMAGES.workshop],
      buttons: [btn("Explore My Teachings", "/blog", "secondary")],
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("about-values", "iconList", 5, {
      label: "Values",
      heading: "What I Value Most",
      items: [
        { title: "Presence", body: "Showing up fully—with attention, patience, and respect for what is unfolding." },
        { title: "Truth", body: "Creating a space where honesty is safe, and clarity can emerge without force." },
        { title: "Compassion", body: "Meeting each person where they are—with warmth, depth, and without judgment." },
        { title: "Integration", body: "Supporting you to carry insight into your relationships, choices, and daily life." },
      ],
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("about-behind", "galleryStrip", 6, {
      label: "Behind the Work",
      heading: "Behind the Work",
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("about-quote", "editorialQuote", 7, {
      label: "Quote",
      heading: "Teacher. Guide. Mirror for Your Soul.",
      body: "<p>“You don't have to become someone new. You just have to return to who you've always been. The heart knows the way.”</p>",
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("about-cta", "bookingCTA", 8, {
      label: "Final CTA",
      heading: "Let's Begin With What Matters",
      body: "<p>Your heart already has the answers. Let's uncover them—together.</p>",
      buttons: [btn("Book a Session", "/booking")],
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
  ];

  const servicesSections: PageSection[] = [
    section("services-hero", "hero", 0, {
      label: "Services Hero",
      heading: "Ways to Work with Rayana",
      body: "<p>Private sessions, wisdom teachings, and group experiences—each designed to help you see beneath the surface, understand what is true, and integrate that knowing into your life.</p>",
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("services-private", "splitStory", 1, { label: "Private Sessions", layoutVariant: "mockup" }),
    section("services-teachings", "splitStory", 2, { label: "Teachings", layoutVariant: "mockup" }),
    section("services-group", "splitStory", 3, { label: "Group Experiences", layoutVariant: "mockup" }),
    section("services-process", "numberedSteps", 4, {
      label: "Process",
      eyebrow: "A Journey of Integration",
      heading: "Arrive — Listen — Integrate",
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("services-outcomes", "iconList", 5, {
      label: "Outcomes",
      eyebrow: "Possibilities Await",
      heading: "What May Open",
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("services-paths", "iconList", 6, {
      label: "Path Cards",
      eyebrow: "Find the Path That Meets You",
      heading: "Which Path Is Calling You?",
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
    section("services-faq", "faqPreview", 7, {
      label: "FAQ",
      eyebrow: "Questions You Might Have",
      heading: "Common Questions",
      settings: { limit: 5 },
      themeVariant: "ivory",
      layoutVariant: "mockup",
    }),
    section("services-cta", "bookingCTA", 8, {
      label: "Final CTA",
      heading: "Your Next Step Can Be Gentle",
      body: "<p>You don't need to have it all figured out. Begin with a single conversation—and let clarity unfold from there.</p>",
      buttons: [btn("Book a Session", "/booking")],
      images: [IMAGES.sacred],
      themeVariant: "burgundy",
      layoutVariant: "mockup",
    }),
  ];

  const pricingSections: PageSection[] = [
    section("pricing-hero", "hero", 0, {
      heading: "Pricing",
      body: "<p>Transparent, warm presentation of session rates, packages, and programmes—all in CAD.</p>",
      images: [IMAGES.sacred],
    }),
    section("pricing-intro", "intro", 1, {
      body: "<p>Investing in your inner life is deeply personal. These offerings reflect the time, presence, and decades of experience Rayana brings to each session.</p>",
    }),
    section("pricing-spotlight", "pricingSpotlight", 2, {
      heading: "Featured Packages",
      settings: { showAll: true },
      images: [IMAGES.texture],
    }),
    section("pricing-note", "richText", 3, {
      body: "<p>First-session specials and limited-time programme rates are controlled from admin and expire automatically when configured.</p>",
    }),
    section("pricing-cta", "bookingCTA", 4, {
      heading: "Questions about which offering fits?",
      buttons: [btn("Contact Rayana", "/contact"), btn("Book a Session", "/booking", "secondary")],
    }),
  ];

  const testimonialsSections: PageSection[] = [
    section("testimonials-hero", "hero", 0, {
      label: "Testimonials Hero",
      eyebrow: "Kind Words",
      heading: "From the Heart",
      layoutVariant: "mockup",
    }),
  ];

  const faqsSections: PageSection[] = [
    section("faqs-hero", "hero", 0, {
      label: "FAQ Hero",
      eyebrow: "Questions You Might Have",
      heading: "Common Questions",
      layoutVariant: "mockup",
    }),
  ];

  const contactSections: PageSection[] = [
    section("contact-hero", "hero", 0, {
      label: "Contact Hero",
      eyebrow: "Reach Out",
      heading: "Get in Touch",
      layoutVariant: "mockup",
    }),
  ];

  const blogSections: PageSection[] = [
    section("blog-hero", "hero", 0, {
      heading: "Journal",
      body: "<p>Reflections on consciousness, relationships, and the path of inner knowing.</p>",
      images: [IMAGES.nature],
    }),
    section("blog-intro", "intro", 1, {
      body: "<p>Editorial writing for those walking a thoughtful spiritual path.</p>",
    }),
    section("blog-feature", "mediaFeature", 2, {
      settings: { contentType: "blog", showFeatured: true },
    }),
  ];

  const mediaSections: PageSection[] = [
    section("media-hero", "hero", 0, {
      heading: "Media",
      body: "<p>Teachings, conversations, and video offerings—coming soon.</p>",
      images: [IMAGES.teaching],
    }),
    section("media-feature", "mediaFeature", 1, {
      settings: { contentType: "media", emptyState: true },
    }),
    section("media-newsletter", "newsletter", 2, {
      heading: "Be notified when new media arrives",
    }),
  ];

  const shopSections: PageSection[] = [
    section("shop-hero", "hero", 0, {
      heading: "Shop",
      body: "<p>Digital offerings, courses, and gifts—coming soon.</p>",
      images: [IMAGES.texture],
    }),
    section("shop-intro", "intro", 1, {
      body: "<p>This section remains available in admin while hidden from navigation until launch.</p>",
    }),
    section("shop-contact", "contactPanel", 2, {
      heading: "Contact to purchase",
      buttons: [btn("Contact", "/contact")],
    }),
  ];

  const bookingSections: PageSection[] = [
    section("booking-hero", "hero", 0, {
      heading: "Book a Session",
      body: "<p>Choose your service, delivery mode, and a time that works in your local time zone.</p>",
      images: [IMAGES.sacred, IMAGES.session],
    }),
    section("booking-intro", "intro", 1, {
      body: "<p>Available times are shown in your time zone. Confirmation includes both your local time and Rayana's Vancouver time.</p>",
    }),
    section("booking-steps", "numberedSteps", 2, {
      items: [
        { title: "Choose a service", body: "Private consultation, mentoring, or another offering." },
        { title: "Select a time", body: "Pick from available slots, converted to your time zone." },
        { title: "Confirm", body: "Complete payment or e-transfer instructions as configured." },
      ],
    }),
    section("booking-faq", "faqPreview", 3, {
      settings: { category: "Booking" },
    }),
  ];

  const reviewSections: PageSection[] = [
    section("review-hero", "hero", 0, {
      heading: "Share Your Experience",
      body: "<p>Your words help others recognise whether this work may be right for them.</p>",
      images: [IMAGES.workshop],
    }),
    section("review-intro", "intro", 1, {
      body: "<p>Submissions are reviewed before appearing publicly. You may choose initials or full name display.</p>",
    }),
    section("review-form", "contactPanel", 2, {
      settings: { showReviewForm: true },
    }),
  ];

  const legalBody = (title: string, content: string): PageSection[] => [
    section(`${title}-hero`, "hero", 0, { heading: title }),
    section(`${title}-content`, "richText", 1, {
      body: `<p><em>This content requires final owner and legal review before launch.</em></p>${content}`,
    }),
  ];

  return [
    {
      systemKey: "home",
      title: "Home",
      slug: "home",
      route: "/",
      navigationLabel: "Home",
      showInNavigation: true,
      sections: homeSections,
      seo: { title: "Home", description: "A Deeper Way of Seeing into What Matters" },
    },
    {
      systemKey: "about",
      title: "About",
      slug: "about",
      route: "/about",
      navigationLabel: "About",
      sections: aboutSections,
      seo: { title: "About Rayana De Silva", description: "My story, philosophy, and approach to Heart Matters work." },
    },
    {
      systemKey: "services",
      title: "Services",
      slug: "services",
      route: "/services",
      navigationLabel: "Services",
      sections: servicesSections,
      seo: { title: "Services", description: "Private consultations, wisdom mentoring, teachings, and more." },
    },
    {
      systemKey: "pricing",
      title: "Pricing",
      slug: "pricing",
      route: "/pricing",
      navigationLabel: "Pricing",
      sections: pricingSections,
      seo: { title: "Pricing", description: "Session rates, packages, and programme pricing in CAD." },
    },
    {
      systemKey: "testimonials",
      title: "Testimonials",
      slug: "testimonials",
      route: "/testimonials",
      navigationLabel: "Testimonials",
      sections: testimonialsSections,
      seo: { title: "Testimonials", description: "Reflections from clients and students." },
    },
    {
      systemKey: "faqs",
      title: "FAQs",
      slug: "faqs",
      route: "/faqs",
      navigationLabel: "FAQ",
      sections: faqsSections,
      seo: { title: "FAQs", description: "Answers about sessions, booking, payment, and preparation." },
    },
    {
      systemKey: "contact",
      title: "Contact",
      slug: "contact",
      route: "/contact",
      navigationLabel: "Contact",
      sections: contactSections,
      seo: { title: "Contact", description: "Reach Rayana De Silva in Richmond, BC." },
    },
    {
      systemKey: "blog",
      title: "Journal",
      slug: "blog",
      route: "/blog",
      navigationLabel: "Journal",
      sections: blogSections,
      seo: { title: "Journal", description: "Reflections on consciousness and inner knowing." },
    },
    {
      systemKey: "media",
      title: "Media",
      slug: "media",
      route: "/media",
      navigationLabel: "Media",
      showInNavigation: false,
      sections: mediaSections,
      seo: { title: "Media", description: "Video and teaching media from Rayana De Silva." },
    },
    {
      systemKey: "shop",
      title: "Shop",
      slug: "shop",
      route: "/shop",
      navigationLabel: "Shop",
      showInNavigation: false,
      sections: shopSections,
      seo: { title: "Shop", description: "Digital offerings and gifts." },
    },
    {
      systemKey: "booking",
      title: "Book a Session",
      slug: "booking",
      route: "/booking",
      navigationLabel: "Book a Session",
      showInNavigation: false,
      sections: bookingSections,
      seo: { title: "Book a Session", description: "Schedule a private consultation or mentoring session." },
    },
    {
      systemKey: "write-a-review",
      title: "Write a Review",
      slug: "write-a-review",
      route: "/write-a-review",
      navigationLabel: "Write a Review",
      showInNavigation: false,
      sections: reviewSections,
      seo: { title: "Write a Review", description: "Share your experience working with Rayana." },
    },
    {
      systemKey: "privacy",
      title: "Privacy Policy",
      slug: "privacy",
      route: "/privacy",
      navigationLabel: "Privacy",
      showInNavigation: false,
      sections: legalBody(
        "Privacy Policy",
        "<p>This privacy policy describes how personal information is collected, used, and protected when you visit this website or submit forms. Final legal copy to be confirmed before launch.</p>",
      ),
      seo: { title: "Privacy Policy", description: "Privacy policy for Rayana De Silva — Heart Matters." },
    },
    {
      systemKey: "terms",
      title: "Terms of Use",
      slug: "terms",
      route: "/terms",
      navigationLabel: "Terms",
      showInNavigation: false,
      sections: legalBody(
        "Terms of Use",
        "<p>These terms govern use of this website and its services. Final legal copy to be confirmed before launch.</p>",
      ),
      seo: { title: "Terms of Use", description: "Terms of use for this website." },
    },
    {
      systemKey: "disclaimer",
      title: "Disclaimer",
      slug: "disclaimer",
      route: "/disclaimer",
      navigationLabel: "Disclaimer",
      showInNavigation: false,
      sections: legalBody("Disclaimer", `<p>${SPIRITUAL_DISCLAIMER}</p>`),
      seo: { title: "Disclaimer", description: "Spiritual services disclaimer." },
    },
    {
      systemKey: "cancellation-policy",
      title: "Cancellation Policy",
      slug: "cancellation-policy",
      route: "/cancellation-policy",
      navigationLabel: "Cancellation Policy",
      showInNavigation: false,
      sections: legalBody(
        "Cancellation Policy",
        "<p>A minimum of 24 hours' notice is required to reschedule a booked session. Secure reschedule links are included in confirmation emails. Final cancellation and refund terms to be confirmed before launch.</p>",
      ),
      seo: { title: "Cancellation Policy", description: "Cancellation and rescheduling policy." },
    },
  ];
}

async function upsertPages(): Promise<void> {
  log("Upserting system pages…");
  const pages = buildPages();

  for (const page of pages) {
    await Page.findOneAndUpdate(
      { systemKey: page.systemKey },
      {
        ...page,
        status: "published",
        revision: 1,
        updatedBy: "seed",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    log(`  Page: ${page.systemKey}`);
  }
}

function buildServices() {
  const gallerySet = [
    IMAGES.portrait1,
    IMAGES.hands,
    IMAGES.session,
    IMAGES.sacred,
    IMAGES.landscape,
  ];

  return [
    {
      title: "Private Consultations",
      slug: "private-consultations",
      shortDescription:
        "Clairvoyance and channel sessions for clarity, insight, personal guidance, and the energetic healing that occurs beneath the surface.",
      mainImage: IMAGES.portrait1,
      pricePreview: "CAD 220 · First session CAD 170",
      duration: "60 minutes",
      modes: ["Zoom", "FaceTime", "Email", "Phone", "In person"],
      status: "active",
      badge: "Clairvoyance & Channel",
      featured: true,
      displayOrder: 0,
      cardCta: { label: "Learn More", href: "/services/private-consultations" },
      bookable: true,
      standardPrice: 220,
      specialPrice: 170,
      specialOfferActive: true,
      detailPage: {
        hero: {
          heading: "Private Consultations",
          subheading: "Clairvoyance & Channel",
          promise: "Clarity, insight, and guidance beneath the surface of what you are experiencing.",
          chips: ["60 minutes", "CAD 220", "Zoom · FaceTime · Phone · Email · In person"],
          image: IMAGES.portrait1,
        },
        introduction:
          "Private consultations offer a focused space to look deeply into what is happening in your life—relationships, transitions, questions of purpose, and the patterns shaping your experience.",
        audience:
          "For thoughtful individuals ready to see beneath the surface and receive clear, compassionate guidance.",
        explorationTopics: [
          "Relationships and love",
          "Life direction and purpose",
          "Patterns, beliefs, and attachments",
          "Transitions and crossroads",
          "Spiritual questions and inner knowing",
        ],
        expectations:
          "Sessions are conversational, direct, and compassionate. Rayana sees, feels, and senses what is present—offering clarity without telling you who you should be.",
        process:
          "We begin by clarifying your questions. Rayana then works intuitively and clairvoyantly, sharing what emerges and supporting integration before the session closes.",
        benefits: [
          "Greater clarity about what is happening",
          "Deeper understanding of underlying patterns",
          "Practical direction for next steps",
          "Energetic support and in-session healing",
        ],
        practicalDetails:
          "Standard sessions are 60 minutes. Allow 90 minutes in your schedule in case additional time is needed. First-session special pricing is available when active.",
        gallery: gallerySet,
        faqs: [
          {
            question: "How should I prepare my questions?",
            answer:
              "Prepare at least three questions if possible. This helps focus the energy of the reading.",
          },
          {
            question: "Can I record the session?",
            answer: "You may set up your own recording, or arrange a secure recording link after booking.",
          },
        ],
        selectedTestimonialSlug: "a-kozelsky",
        relatedServiceSlugs: ["wisdom-mentoring", "teachings-courses"],
        bookingCta: {
          heading: "Book a private consultation",
          body: "Choose your preferred delivery mode and an available time.",
          buttonLabel: "Book a Session",
        },
        seo: {
          title: "Private Consultations | Rayana De Silva",
          description: "Clairvoyance and channel sessions for clarity and personal guidance.",
        },
      },
    },
    {
      title: "Wisdom Mentoring",
      slug: "wisdom-mentoring",
      shortDescription:
        "Interactive talk sessions for clarification, depth, and greater understanding—especially after a private session.",
      mainImage: IMAGES.session,
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
          promise: "Explore the nitty gritty, integrate insight, and refine your next steps.",
          chips: ["60 minutes", "CAD 170", "Zoom · FaceTime · Phone · In person"],
          image: IMAGES.session,
        },
        introduction:
          "Wisdom mentoring is an interactive conversation for those who want to go deeper into what emerged in a session—or who need practical clarity about how to move forward.",
        audience: "Ideal after a private consultation, or when you want focused dialogue rather than a full reading.",
        explorationTopics: [
          "Integrating session insights",
          "Practical next steps",
          "Relationships and communication",
          "Life decisions and integrity",
          "Ongoing inner work",
        ],
        expectations: "A collaborative, grounded conversation with space for questions, reflection, and honest exploration.",
        process: "We focus on what is alive for you now—unpacking insight, exploring options, and identifying concrete steps.",
        benefits: [
          "Greater practical clarity",
          "Support integrating spiritual insight",
          "Honest, compassionate dialogue",
          "Refined direction for your path",
        ],
        practicalDetails: "60-minute sessions. Available via Zoom, FaceTime, phone, or in person where offered.",
        gallery: gallerySet,
        faqs: [],
        selectedTestimonialSlug: "i-shecter",
        relatedServiceSlugs: ["private-consultations", "the-deepening"],
        bookingCta: {
          heading: "Book wisdom mentoring",
          body: "Continue the conversation with focused support.",
          buttonLabel: "Book a Session",
        },
        seo: {
          title: "Wisdom Mentoring | Rayana De Silva",
          description: "Interactive mentoring for integration and practical clarity.",
        },
      },
    },
    {
      title: "Teachings & Courses",
      slug: "teachings-courses",
      shortDescription:
        "Live interactive programmes through Zoom for those ready to deepen awareness and learn practical energetic systems.",
      mainImage: IMAGES.teaching,
      pricePreview: "From CAD 500",
      duration: "Programme-based",
      modes: ["Zoom"],
      status: "active",
      badge: "Live programmes",
      featured: true,
      displayOrder: 2,
      cardCta: { label: "Learn More", href: "/services/teachings-courses" },
      bookable: false,
      detailPage: {
        hero: {
          heading: "Teachings & Courses",
          subheading: "Experience the Journey Within",
          promise: "Structured teachings for alignment, energetic literacy, and inner knowing.",
          chips: ["Live on Zoom", "Level 1 & Level 2", "Limited class sizes"],
          image: IMAGES.teaching,
        },
        introduction:
          "For those ready to move beyond occasional sessions into structured learning—alignment, chakras, charging energetic systems with intention, and learning to read oneself and others.",
        audience: "Spiritually curious individuals committed to regular practice and group learning.",
        explorationTopics: [
          "Chakras 1–7 and beyond",
          "Energetic alignment",
          "Clairvoyance, clairsentience, clairaudience",
          "Discernment and reading others",
          "Grounded energetic practice",
        ],
        expectations: "Live, interactive classes with practical exercises and individual support within a held group container.",
        process: "Programmes run over 12 weeks with two-hour weekly sessions and limited class sizes.",
        benefits: [
          "Structured energetic education",
          "Safe group container",
          "Practical tools for daily life",
          "Deepening self-trust and discernment",
        ],
        practicalDetails: "See Pricing for Journey Within Level 1 and Level 2 details, prerequisites, and current rates.",
        gallery: [IMAGES.teaching, IMAGES.workshop, IMAGES.sacred, IMAGES.hands, IMAGES.texture],
        faqs: [],
        relatedServiceSlugs: ["private-consultations"],
        bookingCta: {
          heading: "Enquire about programmes",
          body: "Contact Rayana to learn about upcoming cohorts.",
          buttonLabel: "Contact",
        },
        seo: {
          title: "Teachings & Courses | Rayana De Silva",
          description: "Live Zoom programmes including Experience the Journey Within.",
        },
      },
    },
    {
      title: "Workshops & Retreats",
      slug: "workshops-retreats",
      shortDescription: "Immersive transformation experiences—coming soon.",
      mainImage: IMAGES.workshop,
      pricePreview: "TBA",
      duration: "Immersive",
      modes: ["In person"],
      status: "coming_soon",
      badge: "Coming soon",
      displayOrder: 3,
      cardCta: { label: "Learn More", href: "/services/workshops-retreats" },
      bookable: false,
      detailPage: {
        hero: {
          heading: "Workshops & Retreats",
          subheading: "Immersive transformation",
          promise: "Deep collective containers for presence, learning, and renewal.",
          chips: ["Coming soon", "Location TBA"],
          image: IMAGES.workshop,
        },
        introduction: "Immersive workshops and retreats are in development. Location and pricing will be announced when ready.",
        audience: "Those drawn to collective deep work in held, beautiful environments.",
        explorationTopics: ["Immersive practice", "Group channel", "Nature and presence"],
        expectations: "Details forthcoming.",
        process: "To be announced.",
        benefits: ["Collective depth", "Renewed presence", "Community of practice"],
        practicalDetails: "Join the newsletter to hear when workshops and retreats are announced.",
        gallery: [IMAGES.workshop, IMAGES.nature, IMAGES.landscape, IMAGES.sacred, IMAGES.session],
        faqs: [],
        relatedServiceSlugs: ["teachings-courses"],
        bookingCta: {
          heading: "Stay informed",
          body: "Workshops and retreats are coming soon.",
          buttonLabel: "Contact",
        },
        seo: {
          title: "Workshops & Retreats | Rayana De Silva",
          description: "Immersive transformation experiences—coming soon.",
        },
      },
    },
    {
      title: "Meditation Practice & Group Channel",
      slug: "meditation-group-channel",
      shortDescription:
        "Membership-based group channel for deepening inner awareness and cultivating presence—coming soon.",
      mainImage: IMAGES.sacred,
      pricePreview: "Coming soon",
      duration: "Ongoing membership",
      modes: ["Online"],
      status: "coming_soon",
      badge: "Coming soon",
      displayOrder: 4,
      cardCta: { label: "Learn More", href: "/services/meditation-group-channel" },
      bookable: false,
      detailPage: {
        hero: {
          heading: "Meditation Practice & Group Channel",
          subheading: "Deepening presence together",
          promise: "A membership space for meditation, practice, and group channel work.",
          chips: ["Coming soon", "Membership"],
          image: IMAGES.sacred,
        },
        introduction:
          "A Patreon-style membership channel is in development for ongoing meditation practice and group presence.",
        audience: "Practitioners wanting regular support and community.",
        explorationTopics: ["Meditation", "Presence", "Group channel"],
        expectations: "Details forthcoming.",
        process: "To be announced.",
        benefits: ["Ongoing practice support", "Community container", "Regular teachings"],
        practicalDetails: "Launch date and pricing to be announced.",
        gallery: [IMAGES.sacred, IMAGES.texture, IMAGES.nature, IMAGES.teaching, IMAGES.session],
        faqs: [],
        relatedServiceSlugs: ["teachings-courses"],
        bookingCta: {
          heading: "Coming soon",
          body: "Join the newsletter to be notified at launch.",
          buttonLabel: "Stay Connected",
        },
        seo: {
          title: "Meditation & Group Channel | Rayana De Silva",
          description: "Membership-based group channel—coming soon.",
        },
      },
    },
  ];
}

async function upsertServices(): Promise<void> {
  log("Upserting services…");
  for (const service of buildServices()) {
    await Service.findOneAndUpdate({ slug: service.slug }, service, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    log(`  Service: ${service.slug}`);
  }
}

function buildPricingPlans() {
  return [
    {
      title: "Private Consultation",
      slug: "private-consultation",
      description: "Clairvoyance & channel session",
      features: ["60 minutes", "Zoom, FaceTime, phone, email, or in person", "Personal guidance and insight"],
      price: 220,
      currency: "CAD",
      ctaLabel: "Book a Session",
      ctaHref: "/booking",
      relatedServiceSlug: "private-consultations",
      displayOrder: 0,
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
      ctaLabel: "Book a Session",
      ctaHref: "/booking",
      relatedServiceSlug: "private-consultations",
      displayOrder: 1,
      featured: true,
    },
    {
      title: "Wisdom Mentoring",
      slug: "wisdom-mentoring-session",
      description: "Interactive integration and depth session",
      features: ["60 minutes", "Ideal after a private session"],
      price: 170,
      currency: "CAD",
      ctaLabel: "Book a Session",
      ctaHref: "/booking",
      relatedServiceSlug: "wisdom-mentoring",
      displayOrder: 2,
    },
    {
      title: "The Deepening",
      slug: "the-deepening",
      description: "Three months of dedicated evolution",
      features: [
        "3 private sessions",
        "4 wisdom mentoring sessions",
        "Integration practices between sessions",
        "Limited between-session support",
        "Personalised direction and focus",
      ],
      price: 2400,
      salePrice: 1800,
      monthlyPrice: 800,
      saleMonthlyPrice: 600,
      currency: "CAD",
      badge: "Founding client rate available",
      ctaLabel: "Enquire & Book",
      ctaHref: "/contact",
      displayOrder: 3,
      featured: true,
      image: IMAGES.sacred,
      terms: "Package terms and scheduling details confirmed at booking.",
    },
    {
      title: "Experience the Journey Within — Level 1",
      slug: "journey-within-level-1",
      description: "12 sessions over 12 weeks · 2 hours per week · class size limited to 10",
      features: [
        "Alignment and chakras 1–7",
        "Charging energetic systems with intention",
        "Learning to read oneself",
        "Live interactive Zoom classes",
      ],
      price: 600,
      salePrice: 500,
      currency: "CAD",
      badge: "Limited-time special",
      ctaLabel: "Enquire",
      ctaHref: "/contact",
      relatedServiceSlug: "teachings-courses",
      displayOrder: 4,
      image: IMAGES.teaching,
    },
    {
      title: "Experience the Journey Within — Level 2",
      slug: "journey-within-level-2",
      description: "Prerequisite: Level 1 · 12 sessions over 12 weeks · 2 hours per week",
      features: [
        "Continued alignment",
        "Out-of-body chakras 8–12",
        "Beginning to read others",
        "Clairvoyance, clairsentience, clairaudience, and discernment",
      ],
      price: 600,
      currency: "CAD",
      ctaLabel: "Enquire",
      ctaHref: "/contact",
      relatedServiceSlug: "teachings-courses",
      displayOrder: 5,
      image: IMAGES.workshop,
    },
  ];
}

async function upsertPricingPlans(): Promise<void> {
  log("Upserting pricing plans…");
  for (const plan of buildPricingPlans()) {
    await PricingPlan.findOneAndUpdate({ slug: plan.slug }, plan, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    log(`  Plan: ${plan.slug}`);
  }
}

function buildTestimonials() {
  return [
    {
      slug: "a-kozelsky",
      name: "A. Kozelsky",
      role: "Social Worker/Therapist",
      quote:
        "Over the last several years, I've been on a healing journey and have had the pleasure of working with Rayana. She has helped me develop a deep spiritual awareness of myself, which was a part of me that I was previously entirely disconnected from. Rayana is able to quickly hone in on core issues and present them in a clear, nonjudgmental way that inspires change. You think you're going in with one problem, but you finish with such a deeper understanding of yourself on all levels. Rayana also provides practical advice on moving forward as well as in-session healing, resulting in immediate soothing and comfort. The growth that I've experienced as a result of Rayana's guidance is invaluable, and I am so grateful for her support.",
      featured: true,
      displayOrder: 0,
    },
    {
      slug: "i-shecter",
      name: "I. Shecter",
      role: "Tour Guide/Entrepreneur",
      quote:
        "I am grateful for Rayana's presence in my life on many accounts. From the very beginning, her support on my journey has been constant, steady, and comforting. Her insights and perspective are pragmatic and relatable, and have aided me in creating an authentic and stable foundation from which to grow. I have felt heard and understood throughout our work together, in large part due to her active and accomplished listening skills. Rayana creates deeply powerful safe spaces and fills them with compassion, providing me with the opportunity to expose my vulnerabilities without shame or fear of judgement. Rayana's honesty and transparency are values that she embodies in her work, as her no-nonsense approach provided the extra push I needed to be more truthful with myself. I also appreciate her ability to maintain a keen sense of humour, even when faced with challenging circumstances. Thank you for everything, Rayana.",
      featured: true,
      displayOrder: 1,
    },
    {
      slug: "n-boroumand",
      name: "N. Boroumand",
      role: "Teacher/Environmentalist",
      quote:
        "I am deeply grateful that Rayana came into my life, for I know that without her insights and guidance, I would still be living an unfulfilling and uncreative life. I knew something about my life was not quite right, but I could not figure out what it was nor what steps I could take to address it. Rayana was able to direct me in exactly the directions that have helped me turn my life from mediocre to deeply fulfilling. She was able to tap deep into the core of the problems and guide me in profound ways that allowed me to take actions that have transformed my life in long-term and sustainable ways, and seem to expand daily. Rayana has truly been a gift to my existence.",
      featured: true,
      displayOrder: 2,
    },
    {
      slug: "m-rogers",
      name: "M. Rogers",
      role: "Chief Coaching Officer",
      quote:
        "Hi Rayana, we spoke on Sunday. Well, you spoke and I listened and learned. OK, I made jokes too! Thank you for your insights and for your intuitive gift. Your connection to the higher truth about my path was heart-warming, validating and, in case you didn't already know, extremely accurate. You helped to add another layer to the picture I am manifesting—or perhaps the picture I am being manifested into. Many thanks. You are a wonderful addition to my world.",
      displayOrder: 3,
    },
    {
      slug: "d-merizzi",
      name: "D. Merizzi",
      role: "Senior Business Analyst",
      quote:
        "Rayana offered to help when I was feeling unsure about a direction in my career search. With her natural and easy approach, Rayana shared her intuition with me as it appeared in her mind's eye. I went to the interviews we had discussed with confidence and was truly amazed at how accurate Rayana had been in regard to both the approach to take and the personality types I would experience from the interviewers. Rayana's counsel was specifically accurate, and I recommend her services without hesitation.",
      displayOrder: 4,
    },
    {
      slug: "upchar",
      name: "Upchar",
      role: "Ayurvedic Massage Therapist",
      quote:
        "When I first met Rayana, being neighbours in one of the most beautiful coconut huts on a mountain ridge above the beach, she revealed herself as being a 'meat and potato psychic'—really down to earth, in the world, but somehow not from it. We became friends and at the same time she was my teacher. It is wonderful that both can work together. Her psychic abilities and clarity are impressive, but even greater is that immensely big heart of hers, which can encompass every living being and feel and be with it, whatever the pain, whatever it needs. Thank you so much.",
      displayOrder: 5,
    },
    {
      slug: "g-kuhlebrock",
      name: "G. Kuhlebrock",
      role: "Germany",
      quote:
        "I want to thank you for the really good workshop. You are a very good teacher because you lead the group with love and safety, understanding and helping us individually, while at the same time guiding the group so that it remained undisturbed by our individual processes. I was familiar with the material you covered, but you showed me the context in a simple way so that suddenly I understood. With your concept, I am able to use and work with my energy field in a safe way that allows me to feel grounded at the same time.",
      displayOrder: 6,
    },
    {
      slug: "d-van-dusen",
      name: "D. Van Dusen",
      role: "Assistant Accountant, Film",
      quote:
        "I have been a client of Rayana's for 15 years or so, and once I started with her, it became very difficult to be treated by anyone else. Rayana combines her professional skills with her ability to heal and comfort me just by her touch or simply by her presence, both of which I find calming. She is a professional with a special gift for healing, and this is what makes her treatments and sessions truly unique. Many thanks, Rayana.",
      featured: true,
      displayOrder: 7,
    },
  ].map((item, index) => ({
    ...item,
    excerpt: item.quote.slice(0, 180) + (item.quote.length > 180 ? "…" : ""),
    status: "approved" as const,
    showFullName: true,
    displayOrder: item.displayOrder ?? index,
  }));
}

async function upsertTestimonials(): Promise<void> {
  log("Upserting testimonials…");
  for (const testimonial of buildTestimonials()) {
    await Testimonial.findOneAndUpdate({ slug: testimonial.slug }, testimonial, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    log(`  Testimonial: ${testimonial.slug}`);
  }
}

function buildFaqs() {
  return [
    {
      slug: "prepare-questions",
      category: "Sessions",
      question: "How should I prepare my questions?",
      answer:
        "Prepare at least three questions if possible. This helps focus the energy of the reading and allows Rayana to look more deeply into what is happening. If you are unsure, the opening moments of the session can be used to clarify them together.",
      displayOrder: 0,
    },
    {
      slug: "before-session",
      category: "Sessions",
      question: "What should I do before a session?",
      answer:
        "Allow about ten quiet minutes beforehand to relax, centre your energy, and collect your thoughts and feelings.",
      displayOrder: 1,
    },
    {
      slug: "session-length",
      category: "Sessions",
      question: "How long is a session?",
      answer:
        "Standard private sessions are 60 minutes. It is wise to keep 90 minutes free in case the session needs additional time to conclude what is coming through.",
      displayOrder: 2,
    },
    {
      slug: "record-session",
      category: "Sessions",
      question: "Can I record the session?",
      answer:
        "Clients may set up their own recording. A recording can also be arranged after booking and delivered through a secure email link.",
      displayOrder: 3,
    },
    {
      slug: "online-sessions",
      category: "Sessions",
      question: "Are phone and online sessions less effective?",
      answer:
        "Rayana works through Zoom, FaceTime, phone, email, and selected in-person sessions, depending on the service. Many clients experience profound sessions remotely; choose the mode that allows you to be most present and comfortable.",
      displayOrder: 4,
    },
    {
      slug: "time-zones",
      category: "Booking",
      question: "How does time-zone conversion work?",
      answer:
        "The booking page detects your IANA time zone and displays available times locally. The confirmation email shows both your time zone and Rayana's host time zone (America/Vancouver).",
      displayOrder: 5,
    },
    {
      slug: "reschedule",
      category: "Booking",
      question: "Can I reschedule?",
      answer:
        "A secure reschedule link is included in the confirmation email. Rescheduling transfers the existing successful payment to the new time and does not charge you again. A minimum of 24 hours' notice is required.",
      displayOrder: 6,
    },
    {
      slug: "payment-methods",
      category: "Payment",
      question: "Which payment methods are accepted?",
      answer:
        "Major credit cards can be handled through Stripe when configured. Canadian e-transfer can be offered as a manual-payment option and marked as paid by admin.",
      displayOrder: 7,
    },
  ];
}

async function upsertFaqs(): Promise<void> {
  log("Upserting FAQs…");
  for (const faq of buildFaqs()) {
    await FAQ.findOneAndUpdate({ slug: faq.slug }, { ...faq, status: "published" }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    log(`  FAQ: ${faq.slug}`);
  }
}

const GALLERY_SEED_IMAGES = [
  IMAGES.portrait1,
  IMAGES.portrait2,
  IMAGES.hands,
  IMAGES.landscape,
  IMAGES.session,
  IMAGES.texture,
  IMAGES.sacred,
  IMAGES.teaching,
  IMAGES.workshop,
  IMAGES.nature,
];

async function upsertGallery(): Promise<void> {
  log("Upserting gallery categories and images…");

  const categories = [
    {
      slug: "portraits",
      title: "Portraits",
      description: "Editorial portraiture and presence.",
      coverImage: IMAGES.portrait1,
      displayOrder: 0,
    },
    {
      slug: "sacred-spaces",
      title: "Sacred Spaces",
      description: "Quiet rooms and held environments.",
      coverImage: IMAGES.sacred,
      displayOrder: 1,
    },
    {
      slug: "teachings",
      title: "Teachings",
      description: "Learning, alignment, and energetic literacy.",
      coverImage: IMAGES.teaching,
      displayOrder: 2,
    },
    {
      slug: "workshops",
      title: "Workshops",
      description: "Gathered circles and collective depth.",
      coverImage: IMAGES.workshop,
      displayOrder: 3,
    },
    {
      slug: "journey-nature",
      title: "Journey & Nature",
      description: "Paths, shoreline, and natural light.",
      coverImage: IMAGES.nature,
      displayOrder: 4,
    },
  ];

  for (const category of categories) {
    const saved = await GalleryCategory.findOneAndUpdate(
      { slug: category.slug },
      { ...category, status: "published" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    log(`  Category: ${category.slug}`);

    for (let i = 0; i < 5; i += 1) {
      const imageAsset = GALLERY_SEED_IMAGES[(category.displayOrder * 2 + i) % GALLERY_SEED_IMAGES.length];
      const imageSlug = `${category.slug}-${i + 1}`;
      await GalleryImage.findOneAndUpdate(
        { categorySlug: category.slug, slug: imageSlug },
        {
          categoryId: saved._id,
          categorySlug: category.slug,
          title: `${category.title} ${i + 1}`,
          slug: imageSlug,
          image: imageAsset,
          displayOrder: i,
          status: "published",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
  }
}

function buildBlogPosts() {
  const sampleNotice =
    "<p><strong>Sample content:</strong> This article is editable placeholder copy—not a record of personal events or client results.</p>";

  return [
    {
      slug: "seeing-beneath-the-surface",
      title: "Seeing Beneath the Surface",
      excerpt: "An invitation to look more honestly at the patterns shaping your experience.",
      body: `${sampleNotice}<p>There is a moment when life asks more of us than coping. Something shifts—a relationship, a career, a quiet inner restlessness—and we sense that the old explanations no longer fit.</p><p>This work begins not with answers, but with seeing: what is actually happening, beneath story and habit.</p>`,
      heroImage: IMAGES.landscape,
      categories: ["Reflections"],
      tags: ["consciousness", "patterns"],
      isSampleContent: true,
      readingTimeMinutes: 4,
      publishedAt: new Date("2026-01-15"),
    },
    {
      slug: "the-wisdom-heart",
      title: "The Wisdom Heart",
      excerpt: "Understanding yourself through the lens of the heart changes how you move through the world.",
      body: `${sampleNotice}<p>The wisdom heart is not sentiment—it is clarity married to compassion. It sees what is true without turning away from what is difficult.</p><p>When we learn to listen from this place, decisions become simpler—not easier, but more honest.</p>`,
      heroImage: IMAGES.sacred,
      categories: ["Teachings"],
      tags: ["heart", "knowing"],
      isSampleContent: true,
      readingTimeMinutes: 5,
      publishedAt: new Date("2026-02-01"),
    },
    {
      slug: "presence-at-a-crossroads",
      title: "Presence at a Crossroads",
      excerpt: "Crossroads are not failures—they are invitations to choose with greater consciousness.",
      body: `${sampleNotice}<p>Standing at a crossroads can feel like failure or confusion. Often it is the opposite: a sign that you have outgrown a former version of your life.</p><p>Presence—not urgency—allows the next step to reveal itself.</p>`,
      heroImage: IMAGES.nature,
      categories: ["Reflections"],
      tags: ["transitions", "presence"],
      isSampleContent: true,
      readingTimeMinutes: 3,
      publishedAt: new Date("2026-03-01"),
    },
  ];
}

async function upsertBlogPosts(): Promise<void> {
  log("Upserting sample blog posts…");
  for (const post of buildBlogPosts()) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        ...post,
        author: "Rayana De Silva",
        status: "published",
        seo: { title: post.title, description: post.excerpt },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    log(`  Post: ${post.slug}`);
  }
}

async function upsertAvailabilityRules(): Promise<void> {
  log("Upserting availability rules (Mon–Fri 9am–5pm Vancouver)…");
  const days = [
    { day: 1, label: "Monday" },
    { day: 2, label: "Tuesday" },
    { day: 3, label: "Wednesday" },
    { day: 4, label: "Thursday" },
    { day: 5, label: "Friday" },
  ];

  for (const { day, label } of days) {
    const slug = `weekday-${day}`;
    await AvailabilityRule.findOneAndUpdate(
      { slug },
      {
        slug,
        label: `${label} availability`,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        timeZone: "America/Vancouver",
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    log(`  Rule: ${slug}`);
  }
}

async function seed(): Promise<void> {
  log("Starting seed…");
  await connectDB();

  await upsertSiteSettings();
  await upsertAdminUser();
  await upsertPages();
  await upsertServices();
  await upsertPricingPlans();
  await upsertTestimonials();
  await upsertFaqs();
  await upsertGallery();
  await upsertBlogPosts();
  await upsertAvailabilityRules();

  log("Seed completed successfully.");
}

seed()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error("[seed] Failed:", error);
    process.exit(1);
  });
