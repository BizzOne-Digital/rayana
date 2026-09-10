import type { Button, ImageMedia, PageSection, SEO } from "@/models/shared";
import type { PageSectionType } from "@/lib/constants";

export type { Button, ImageMedia, PageSection, SEO, PageSectionType };

export type IconListItem = {
  title: string;
  body?: string;
  icon?: string;
};

export type NumberedStepItem = {
  title: string;
  body?: string;
};

export type SectionSettings = {
  limit?: number;
  featuredOnly?: boolean;
  showAll?: boolean;
  planSlug?: string;
  showCategories?: boolean;
  category?: string;
  contentType?: "blog" | "media";
  showFeatured?: boolean;
  emptyState?: boolean;
  showForm?: boolean;
  showWhatsApp?: boolean;
  showReviewForm?: boolean;
  showAllTestimonials?: boolean;
};

export type TypedPageSection = PageSection & {
  type: PageSectionType | string;
  items?: IconListItem[] | NumberedStepItem[] | Record<string, unknown>[];
  settings?: SectionSettings;
};

export type PublicPage = {
  title: string;
  slug: string;
  systemKey: string;
  route: string;
  navigationLabel: string;
  showInNavigation: boolean;
  sections: TypedPageSection[];
  seo: SEO;
};

export type PublicService = {
  title: string;
  slug: string;
  shortDescription: string;
  mainImage: ImageMedia;
  pricePreview: string;
  duration: string;
  modes: string[];
  status: "active" | "coming_soon" | "archived";
  badge?: string;
  featured: boolean;
  displayOrder: number;
  cardCta: { label: string; href: string };
  bookable: boolean;
  standardPrice?: number;
  specialPrice?: number;
  specialOfferActive?: boolean;
  detailPage: {
    hero: {
      heading: string;
      subheading: string;
      promise: string;
      chips: string[];
      image?: ImageMedia;
    };
    introduction: string;
    audience: string;
    explorationTopics: string[];
    expectations: string;
    process: string;
    benefits: string[];
    practicalDetails: string;
    gallery: ImageMedia[];
    faqs: Array<{ question: string; answer: string }>;
    selectedTestimonialSlug?: string;
    relatedServiceSlugs: string[];
    bookingCta: { heading: string; body: string; buttonLabel: string };
    seo: { title: string; description: string };
  };
};

export type PublicSettings = {
  brand: {
    name: string;
    tagline: string;
    headline: string;
    footerStatement: string;
    logoUrl?: string;
  };
  contact: {
    email: string;
    displayPhone: string;
    e164Phone: string;
    whatsApp: string;
    location: string;
    responseTimeNote?: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linktree?: string;
  };
  header: {
    primaryCtaLabel: string;
    primaryCtaHref: string;
    showIntroOnFirstVisit: boolean;
  };
  footer: {
    newsletterHeading: string;
    newsletterBody: string;
    copyrightName: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultOgImage?: ImageMedia;
  };
  featureFlags: {
    hideShopInNav: boolean;
    hideMediaInNav: boolean;
    shopEnabled: boolean;
    mediaEnabled: boolean;
  };
  payments?: {
    defaultCurrency: string;
  };
};

export type PublicTestimonial = {
  slug: string;
  name: string;
  role?: string;
  quote: string;
  excerpt: string;
  featured: boolean;
  showFullName: boolean;
};

export type PublicFAQ = {
  slug: string;
  question: string;
  answer: string;
  category: string;
};

export type PublicPricingPlan = {
  title: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  salePrice?: number;
  currency: string;
  badge?: string;
  availability: "active" | "coming_soon" | "archived";
  ctaLabel: string;
  ctaHref: string;
  image?: ImageMedia;
  featured: boolean;
};

export type PublicBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  heroImage: ImageMedia;
  author: string;
  categories: string[];
  publishedAt?: string;
  readingTimeMinutes: number;
  seo: SEO;
};

export type PublicGalleryImage = {
  title: string;
  slug: string;
  categorySlug: string;
  image: ImageMedia;
};

export type PublicProduct = {
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  currency: string;
  image?: ImageMedia;
  status: string;
};

export type PublicMediaPost = {
  title: string;
  slug: string;
  excerpt: string;
  type: string;
  thumbnail?: ImageMedia;
  publishedAt?: string;
};
