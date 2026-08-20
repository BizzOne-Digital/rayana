import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source: "contact_page" | "footer" | "other";
  status: "new" | "read" | "replied" | "archived" | "spam";
  honeypotTriggered: boolean;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    source: {
      type: String,
      enum: ["contact_page", "footer", "other"],
      default: "contact_page",
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived", "spam"],
      default: "new",
    },
    honeypotTriggered: { type: Boolean, default: false },
    ipAddress: { type: String },
    userAgent: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

ContactSubmissionSchema.index({ status: 1, submittedAt: -1 });
ContactSubmissionSchema.index({ email: 1, submittedAt: -1 });
ContactSubmissionSchema.index({ honeypotTriggered: 1 });

export const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>("ContactSubmission", ContactSubmissionSchema);
