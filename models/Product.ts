import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema, SEO, SEOSchema } from "./shared";

export interface IProduct extends Document {
  name: string;
  slug: string;
  summary: string;
  description: string;
  productType: "physical" | "digital" | "course" | "gift-certificate";
  price: number;
  salePrice?: number;
  currency: string;
  stockQuantity?: number;
  stockStatus: "in_stock" | "out_of_stock" | "unlimited";
  gallery: ImageMedia[];
  downloadMetadata?: {
    fileUrl: string;
    fileName: string;
    fileSize?: number;
  };
  stripeProductId?: string;
  stripePriceId?: string;
  seo: SEO;
  visibility: "draft" | "published" | "hidden";
  featured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    productType: {
      type: String,
      enum: ["physical", "digital", "course", "gift-certificate"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    currency: { type: String, default: "CAD" },
    stockQuantity: { type: Number, min: 0 },
    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "unlimited"],
      default: "unlimited",
    },
    gallery: { type: [ImageMediaSchema], default: [] },
    downloadMetadata: {
      fileUrl: { type: String },
      fileName: { type: String },
      fileSize: { type: Number },
    },
    stripeProductId: { type: String },
    stripePriceId: { type: String },
    seo: { type: SEOSchema, default: () => ({}) },
    visibility: {
      type: String,
      enum: ["draft", "published", "hidden"],
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({ visibility: 1, displayOrder: 1 });
ProductSchema.index({ productType: 1, visibility: 1 });
ProductSchema.index({ featured: 1, displayOrder: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
