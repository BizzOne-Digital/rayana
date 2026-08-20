import { z } from "zod";
import {
  buttonSchema,
  imageMediaSchema,
  objectIdSchema,
  pageSectionSchema,
  seoSchema,
  slugSchema,
} from "@/lib/validation/common";
import {
  MEDIA_POST_TYPES,
  PAGE_SECTION_TYPES,
  PRODUCT_TYPES,
} from "@/lib/constants";

export const pageCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  systemKey: z.string().min(1).max(80),
  route: z.string().min(1).max(200),
  navigationLabel: z.string().min(1).max(120),
  status: z.enum(["draft", "published"]).optional(),
  showInNavigation: z.boolean().optional(),
  sections: z.array(pageSectionSchema).optional(),
  seo: seoSchema.optional(),
});

export const pageUpdateSchema = pageCreateSchema.partial();

export const serviceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  shortDescription: z.string().min(1).max(500),
  mainImage: imageMediaSchema,
  pricePreview: z.string().max(120).optional(),
  duration: z.string().max(80).optional(),
  modes: z.array(z.string()).optional(),
  status: z.enum(["active", "coming_soon", "archived"]).optional(),
  badge: z.string().max(80).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  cardCta: z
    .object({
      label: z.string().min(1).max(120),
      href: z.string().min(1).max(500),
    })
    .optional(),
  bookable: z.boolean().optional(),
  standardPrice: z.number().min(0).optional(),
  specialPrice: z.number().min(0).optional(),
  specialOfferActive: z.boolean().optional(),
  detailPage: z.record(z.string(), z.unknown()).optional(),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const pricingPlanSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().min(1),
  features: z.array(z.string()).optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  monthlyPrice: z.number().min(0).optional(),
  saleMonthlyPrice: z.number().min(0).optional(),
  currency: z.string().max(8).optional(),
  badge: z.string().max(80).optional(),
  availability: z.enum(["active", "coming_soon", "archived"]).optional(),
  specialStart: z.coerce.date().optional(),
  specialEnd: z.coerce.date().optional(),
  ctaLabel: z.string().max(120).optional(),
  ctaHref: z.string().max(500).optional(),
  relatedServiceSlug: slugSchema.optional(),
  image: imageMediaSchema.optional(),
  terms: z.string().optional(),
  displayOrder: z.number().int().optional(),
  featured: z.boolean().optional(),
});

export const pricingPlanUpdateSchema = pricingPlanSchema.partial();

export const galleryCategorySchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  description: z.string().max(2000).optional(),
  coverImage: imageMediaSchema,
  displayOrder: z.number().int().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const galleryCategoryUpdateSchema = galleryCategorySchema.partial();

export const galleryImageSchema = z.object({
  categoryId: objectIdSchema,
  categorySlug: slugSchema,
  title: z.string().min(1).max(200),
  slug: slugSchema,
  image: imageMediaSchema,
  displayOrder: z.number().int().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const galleryImageUpdateSchema = galleryImageSchema.partial();

export const testimonialSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional(),
  quote: z.string().min(1),
  excerpt: z.string().min(1).max(500),
  status: z.enum(["pending", "approved", "rejected", "archived"]).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  showFullName: z.boolean().optional(),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const faqSchema = z.object({
  slug: slugSchema,
  question: z.string().min(1).max(500),
  answer: z.string().min(1),
  category: z.string().max(120).optional(),
  displayOrder: z.number().int().optional(),
  status: z.enum(["draft", "published"]).optional(),
  relatedServiceSlug: slugSchema.optional(),
});

export const faqUpdateSchema = faqSchema.partial();

export const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  excerpt: z.string().min(1).max(500),
  body: z.string().min(1),
  heroImage: imageMediaSchema,
  author: z.string().max(120).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "scheduled"]).optional(),
  publishedAt: z.coerce.date().optional(),
  scheduledFor: z.coerce.date().optional(),
  readingTimeMinutes: z.number().int().min(1).optional(),
  isSampleContent: z.boolean().optional(),
  seo: seoSchema.optional(),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export const mediaPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
  type: z.enum(MEDIA_POST_TYPES),
  youtubeUrl: z.string().url(),
  youtubeId: z.string().min(1).max(32),
  description: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  thumbnail: imageMediaSchema.optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  publishedAt: z.coerce.date().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  seo: seoSchema.optional(),
});

export const mediaPostUpdateSchema = mediaPostSchema.partial();

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  summary: z.string().min(1).max(500),
  description: z.string().min(1),
  productType: z.enum(PRODUCT_TYPES),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  currency: z.string().max(8).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  stockStatus: z.enum(["in_stock", "out_of_stock", "unlimited"]).optional(),
  gallery: z.array(imageMediaSchema).optional(),
  downloadMetadata: z
    .object({
      fileUrl: z.string(),
      fileName: z.string(),
      fileSize: z.number().optional(),
    })
    .optional(),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  seo: seoSchema.optional(),
  visibility: z.enum(["draft", "published", "hidden"]).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const productUpdateSchema = productSchema.partial();

export const mediaAssetUpdateSchema = z.object({
  alt: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "archived"]).optional(),
  entityType: z.string().optional(),
  entityId: objectIdSchema.optional(),
});

export const siteSettingsUpdateSchema = z.object({
  brand: z.record(z.string(), z.unknown()).optional(),
  contact: z.record(z.string(), z.unknown()).optional(),
  social: z.record(z.string(), z.unknown()).optional(),
  header: z.record(z.string(), z.unknown()).optional(),
  footer: z.record(z.string(), z.unknown()).optional(),
  seo: z.record(z.string(), z.unknown()).optional(),
  booking: z.record(z.string(), z.unknown()).optional(),
  payments: z.record(z.string(), z.unknown()).optional(),
  email: z.record(z.string(), z.unknown()).optional(),
  featureFlags: z.record(z.string(), z.unknown()).optional(),
  legalNotices: z.record(z.string(), z.unknown()).optional(),
});

export const submissionStatusSchema = z.object({
  status: z.string().min(1),
});

export const bookingAdminUpdateSchema = z.object({
  status: z
    .enum([
      "hold",
      "pending_payment",
      "confirmed",
      "cancelled",
      "completed",
      "no_show",
      "rescheduled",
    ])
    .optional(),
  adminNotes: z.string().max(5000).optional(),
  recordingUrl: z.string().url().or(z.literal("")).optional(),
  cancellationReason: z.string().max(1000).optional(),
});

export const auditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  action: z.string().optional(),
  entityType: z.string().optional(),
});

export const availabilityQuerySchema = z.object({
  serviceSlug: slugSchema,
  clientTimeZone: z.string().min(1).max(80),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export const bookingConfirmSchema = z.object({
  referenceNumber: z.string().min(1),
  paymentMethod: z.enum(["stripe", "e_transfer"]).optional(),
});

export const bookingRescheduleSchema = z.object({
  token: z.string().min(1),
  startUtc: z.coerce.date(),
  endUtc: z.coerce.date(),
  clientTimeZone: z.string().min(1).max(80),
});

export const bookingCancelSchema = z.object({
  token: z.string().optional(),
  referenceNumber: z.string().optional(),
  reason: z.string().max(1000).optional(),
});

export const stripeCheckoutSchema = z.object({
  referenceNumber: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const uploadMetadataSchema = z.object({
  alt: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
  tags: z.string().optional(),
});

export { pageSectionSchema, buttonSchema };
