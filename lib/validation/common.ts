import { z } from "zod";
import {
  ADMIN_ROLES,
  AUDIT_ACTIONS,
  BOOKING_STATUSES,
  MEDIA_POST_TYPES,
  PAGE_SECTION_TYPES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  PRODUCT_TYPES,
} from "@/lib/constants";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const emailSchema = z.string().email().max(320);

export const phoneSchema = z.string().max(32).optional();

export const imageMediaSchema = z.object({
  assetId: z.string().optional(),
  url: z.string().url().or(z.string().startsWith("/")),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
  alt: z.string().max(500).optional(),
  caption: z.string().max(1000).optional(),
  focalPoint: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .optional(),
  decorative: z.boolean().optional(),
  credit: z.string().max(200).optional(),
});

export const buttonSchema = z.object({
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(500),
  variant: z.enum(["primary", "secondary", "ghost", "link"]).optional(),
  openInNewTab: z.boolean().optional(),
});

export const seoSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(320).optional(),
  canonicalUrl: z.string().url().or(z.literal("")).optional(),
  ogTitle: z.string().max(120).optional(),
  ogDescription: z.string().max(320).optional(),
  ogImage: imageMediaSchema.optional(),
  noIndex: z.boolean().optional(),
});

export const pageSectionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(PAGE_SECTION_TYPES),
  label: z.string().optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().optional(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().optional(),
  buttons: z.array(buttonSchema).optional(),
  images: z.array(imageMediaSchema).optional(),
  layoutVariant: z.string().optional(),
  themeVariant: z.string().optional(),
  items: z.array(z.unknown()).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const contactSubmissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
  honeypot: z.literal("").optional(),
});

export const reviewSubmissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: emailSchema.optional(),
  role: z.string().max(120).optional(),
  quote: z.string().min(20).max(5000),
  excerpt: z.string().min(10).max(500),
  serviceSlug: slugSchema.optional(),
  consentToPublish: z.literal(true),
  showFullName: z.boolean().default(true),
  honeypot: z.literal("").optional(),
});

export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
  source: z.string().max(120).optional(),
});

export const bookingClientSchema = z.object({
  name: z.string().min(1).max(120),
  email: emailSchema,
  phone: phoneSchema,
  questions: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
  recordingRequested: z.boolean().default(false),
  policyConsent: z.literal(true),
});

export const bookingCreateSchema = z.object({
  serviceSlug: slugSchema,
  deliveryMode: z.string().min(1).max(80),
  clientTimeZone: z.string().min(1).max(80),
  startUtc: z.coerce.date(),
  endUtc: z.coerce.date(),
  client: bookingClientSchema,
  paymentMethod: z.enum(PAYMENT_METHODS),
});

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
});

export const adminRoleSchema = z.enum(ADMIN_ROLES);

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

export const paymentMethodSchema = z.enum(PAYMENT_METHODS);

export const productTypeSchema = z.enum(PRODUCT_TYPES);

export const mediaPostTypeSchema = z.enum(MEDIA_POST_TYPES);

export const auditActionSchema = z.enum(AUDIT_ACTIONS);

export type ImageMediaInput = z.infer<typeof imageMediaSchema>;
export type ButtonInput = z.infer<typeof buttonSchema>;
export type SEOInput = z.infer<typeof seoSchema>;
export type PageSectionInput = z.infer<typeof pageSectionSchema>;
export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
