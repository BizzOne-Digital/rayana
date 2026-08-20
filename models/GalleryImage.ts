import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { ImageMedia, ImageMediaSchema } from "./shared";

export interface IGalleryImage extends Document {
  categoryId: Types.ObjectId;
  categorySlug: string;
  title: string;
  slug: string;
  image: ImageMedia;
  displayOrder: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "GalleryCategory", required: true },
    categorySlug: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: ImageMediaSchema, required: true },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

GalleryImageSchema.index({ categorySlug: 1, slug: 1 }, { unique: true });
GalleryImageSchema.index({ categoryId: 1, displayOrder: 1 });
GalleryImageSchema.index({ status: 1 });

export const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
