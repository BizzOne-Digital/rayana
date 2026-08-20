import mongoose, { Document, Model, Schema } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  status: "active" | "unsubscribed" | "bounced";
  source?: string;
  confirmationToken?: string;
  confirmedAt?: Date;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["active", "unsubscribed", "bounced"],
      default: "active",
    },
    source: { type: String },
    confirmationToken: { type: String },
    confirmedAt: { type: Date },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true },
);

NewsletterSubscriberSchema.index({ status: 1, subscribedAt: -1 });
NewsletterSubscriberSchema.index({ confirmationToken: 1 }, { sparse: true });

export const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema,
  );
