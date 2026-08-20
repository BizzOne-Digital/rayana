import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema } from "./shared";

export interface IGalleryCategory extends Document {
  title: string;
  slug: string;
  description: string;
  coverImage: ImageMedia;
  displayOrder: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    coverImage: { type: ImageMediaSchema, required: true },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

GalleryCategorySchema.index({ status: 1, displayOrder: 1 });

export const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ||
  mongoose.model<IGalleryCategory>("GalleryCategory", GalleryCategorySchema);
