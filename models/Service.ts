import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema } from "./shared";

export interface IService extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    mainImage: { type: ImageMediaSchema, required: true },
    pricePreview: { type: String, default: "" },
    duration: { type: String, default: "60 minutes" },
    modes: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["active", "coming_soon", "archived"],
      default: "active",
    },
    badge: { type: String },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    cardCta: {
      label: { type: String, default: "Learn More" },
      href: { type: String, default: "" },
    },
    bookable: { type: Boolean, default: true },
    standardPrice: { type: Number },
    specialPrice: { type: Number },
    specialOfferActive: { type: Boolean, default: false },
    detailPage: {
      hero: {
        heading: { type: String, default: "" },
        subheading: { type: String, default: "" },
        promise: { type: String, default: "" },
        chips: { type: [String], default: [] },
        image: { type: ImageMediaSchema },
      },
      introduction: { type: String, default: "" },
      audience: { type: String, default: "" },
      explorationTopics: { type: [String], default: [] },
      expectations: { type: String, default: "" },
      process: { type: String, default: "" },
      benefits: { type: [String], default: [] },
      practicalDetails: { type: String, default: "" },
      gallery: { type: [ImageMediaSchema], default: [] },
      faqs: {
        type: [
          {
            question: String,
            answer: String,
          },
        ],
        default: [],
      },
      selectedTestimonialSlug: { type: String },
      relatedServiceSlugs: { type: [String], default: [] },
      bookingCta: {
        heading: { type: String, default: "Ready to begin?" },
        body: { type: String, default: "" },
        buttonLabel: { type: String, default: "Book a Session" },
      },
      seo: {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    },
  },
  { timestamps: true },
);

ServiceSchema.index({ status: 1, displayOrder: 1 });
ServiceSchema.index({ featured: 1, displayOrder: 1 });
ServiceSchema.index({ bookable: 1, status: 1 });

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
