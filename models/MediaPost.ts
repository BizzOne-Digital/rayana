import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema, SEO, SEOSchema } from "./shared";

export interface IMediaPost extends Document {
  title: string;
  slug: string;
  type: "video" | "podcast" | "teaching";
  youtubeUrl: string;
  youtubeId: string;
  description: string;
  excerpt: string;
  thumbnail?: ImageMedia;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  featured: boolean;
  displayOrder: number;
  seo: SEO;
  createdAt: Date;
  updatedAt: Date;
}

const MediaPostSchema = new Schema<IMediaPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["video", "podcast", "teaching"],
      required: true,
    },
    youtubeUrl: { type: String, required: true },
    youtubeId: { type: String, required: true },
    description: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    thumbnail: { type: ImageMediaSchema },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    seo: { type: SEOSchema, default: () => ({}) },
  },
  { timestamps: true },
);

MediaPostSchema.index({ youtubeId: 1 });
MediaPostSchema.index({ status: 1, publishedAt: -1 });
MediaPostSchema.index({ type: 1, displayOrder: 1 });
MediaPostSchema.index({ featured: 1, displayOrder: 1 });

export const MediaPost: Model<IMediaPost> =
  mongoose.models.MediaPost ||
  mongoose.model<IMediaPost>("MediaPost", MediaPostSchema);
