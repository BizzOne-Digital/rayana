import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { ImageMedia, ImageMediaSchema, PageSection, PageSectionSchema, SEO, SEOSchema } from "./shared";

export interface IPage extends Document {
  title: string;
  slug: string;
  systemKey: string;
  route: string;
  navigationLabel: string;
  status: "draft" | "published";
  showInNavigation: boolean;
  sections: PageSection[];
  seo: SEO;
  revision: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    systemKey: { type: String, required: true, unique: true },
    route: { type: String, required: true },
    navigationLabel: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    showInNavigation: { type: Boolean, default: true },
    sections: { type: [PageSectionSchema], default: [] },
    seo: { type: SEOSchema, default: () => ({}) },
    revision: { type: Number, default: 1 },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { timestamps: true },
);

PageSchema.index({ slug: 1 });
PageSchema.index({ route: 1 });
PageSchema.index({ status: 1, showInNavigation: 1 });

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
