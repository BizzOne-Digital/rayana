import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFAQ extends Document {
  slug: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: "draft" | "published";
  relatedServiceSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    slug: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    relatedServiceSlug: { type: String },
  },
  { timestamps: true },
);

FAQSchema.index({ category: 1, displayOrder: 1 });
FAQSchema.index({ status: 1 });

export const FAQ: Model<IFAQ> =
  mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);
