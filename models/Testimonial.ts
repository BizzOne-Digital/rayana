import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestimonial extends Document {
  slug: string;
  name: string;
  role?: string;
  quote: string;
  excerpt: string;
  status: "pending" | "approved" | "rejected" | "archived";
  featured: boolean;
  displayOrder: number;
  showFullName: boolean;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String },
    quote: { type: String, required: true },
    excerpt: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "archived"],
      default: "approved",
    },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    showFullName: { type: Boolean, default: true },
    submittedAt: { type: Date },
  },
  { timestamps: true },
);

TestimonialSchema.index({ status: 1, featured: 1, displayOrder: 1 });

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
