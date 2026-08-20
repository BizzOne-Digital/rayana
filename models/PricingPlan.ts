import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema, SEO, SEOSchema } from "./shared";

export interface IPricingPlan extends Document {
  title: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  salePrice?: number;
  monthlyPrice?: number;
  saleMonthlyPrice?: number;
  currency: string;
  badge?: string;
  availability: "active" | "coming_soon" | "archived";
  specialStart?: Date;
  specialEnd?: Date;
  ctaLabel: string;
  ctaHref: string;
  relatedServiceSlug?: string;
  image?: ImageMedia;
  terms?: string;
  displayOrder: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    monthlyPrice: { type: Number },
    saleMonthlyPrice: { type: Number },
    currency: { type: String, default: "CAD" },
    badge: { type: String },
    availability: {
      type: String,
      enum: ["active", "coming_soon", "archived"],
      default: "active",
    },
    specialStart: { type: Date },
    specialEnd: { type: Date },
    ctaLabel: { type: String, default: "Book a Session" },
    ctaHref: { type: String, default: "/booking" },
    relatedServiceSlug: { type: String },
    image: { type: ImageMediaSchema },
    terms: { type: String },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PricingPlanSchema.index({ availability: 1, displayOrder: 1 });

export const PricingPlan: Model<IPricingPlan> =
  mongoose.models.PricingPlan ||
  mongoose.model<IPricingPlan>("PricingPlan", PricingPlanSchema);
