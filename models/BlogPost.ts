import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema, SEO, SEOSchema } from "./shared";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  heroImage: ImageMedia;
  author: string;
  categories: string[];
  tags: string[];
  status: "draft" | "published" | "scheduled";
  publishedAt?: Date;
  scheduledFor?: Date;
  readingTimeMinutes: number;
  isSampleContent: boolean;
  seo: SEO;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    body: { type: String, required: true },
    heroImage: { type: ImageMediaSchema, required: true },
    author: { type: String, default: "Rayana De Silva" },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "published",
    },
    publishedAt: { type: Date },
    scheduledFor: { type: Date },
    readingTimeMinutes: { type: Number, default: 5 },
    isSampleContent: { type: Boolean, default: false },
    seo: { type: SEOSchema, default: () => ({}) },
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
