import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReviewSubmission extends Document {
  name: string;
  email?: string;
  role?: string;
  quote: string;
  excerpt: string;
  serviceSlug?: string;
  consentToPublish: boolean;
  showFullName: boolean;
  status: "pending" | "approved" | "rejected" | "spam";
  testimonialId?: Types.ObjectId;
  honeypotTriggered: boolean;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSubmissionSchema = new Schema<IReviewSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    role: { type: String },
    quote: { type: String, required: true },
    excerpt: { type: String, required: true },
    serviceSlug: { type: String },
    consentToPublish: { type: Boolean, required: true },
    showFullName: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
    },
    testimonialId: { type: Schema.Types.ObjectId, ref: "Testimonial" },
    honeypotTriggered: { type: Boolean, default: false },
    ipAddress: { type: String },
    userAgent: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
  },
  { timestamps: true },
);

ReviewSubmissionSchema.index({ status: 1, submittedAt: -1 });
ReviewSubmissionSchema.index({ serviceSlug: 1, status: 1 });
ReviewSubmissionSchema.index({ testimonialId: 1 }, { sparse: true });

export const ReviewSubmission: Model<IReviewSubmission> =
  mongoose.models.ReviewSubmission ||
  mongoose.model<IReviewSubmission>("ReviewSubmission", ReviewSubmissionSchema);
