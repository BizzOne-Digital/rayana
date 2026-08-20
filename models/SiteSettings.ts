import mongoose, { Document, Model, Schema } from "mongoose";
import { ImageMedia, ImageMediaSchema } from "./shared";

export interface ISiteSettings extends Document {
  singletonKey: string;
  brand: {
    name: string;
    tagline: string;
    headline: string;
    footerStatement: string;
    logoUrl?: string;
  };
  contact: {
    email: string;
    displayPhone: string;
    e164Phone: string;
    whatsApp: string;
    location: string;
    responseTimeNote?: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  header: {
    primaryCtaLabel: string;
    primaryCtaHref: string;
    showIntroOnFirstVisit: boolean;
  };
  footer: {
    newsletterHeading: string;
    newsletterBody: string;
    copyrightName: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultOgImage?: ImageMedia;
  };
  booking: {
    hostTimeZone: string;
    rescheduleNoticeHours: number;
    holdDurationMinutes: number;
    eTransferInstructions: string;
  };
  payments: {
    defaultCurrency: string;
    stripeEnabled: boolean;
    eTransferEnabled: boolean;
  };
  email: {
    fromName: string;
    replyTo: string;
  };
  featureFlags: {
    hideShopInNav: boolean;
    hideMediaInNav: boolean;
    shopEnabled: boolean;
    mediaEnabled: boolean;
  };
  legalNotices: {
    requiresOwnerReview: boolean;
    disclaimerSummary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: { type: String, required: true, unique: true, default: "default" },
    brand: {
      name: { type: String, default: "Rayana De Silva — Heart Matters" },
      tagline: { type: String, default: "" },
      headline: { type: String, default: "" },
      footerStatement: { type: String, default: "" },
      logoUrl: { type: String, default: "/brand/rayana-de-silva-heart-matters.png" },
    },
    contact: {
      email: { type: String, default: "" },
      displayPhone: { type: String, default: "" },
      e164Phone: { type: String, default: "" },
      whatsApp: { type: String, default: "" },
      location: { type: String, default: "" },
      responseTimeNote: {
        type: String,
        default: "Rayana personally reads every message and responds as thoughtfully as she can within a few business days.",
      },
    },
    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    header: {
      primaryCtaLabel: { type: String, default: "Book a Session" },
      primaryCtaHref: { type: String, default: "/booking" },
      showIntroOnFirstVisit: { type: Boolean, default: true },
    },
    footer: {
      newsletterHeading: { type: String, default: "Stay Connected" },
      newsletterBody: {
        type: String,
        default: "Receive occasional reflections, teachings, and offerings from Rayana.",
      },
      copyrightName: { type: String, default: "Rayana De Silva — Heart Matters" },
    },
    seo: {
      defaultTitle: { type: String, default: "" },
      defaultDescription: { type: String, default: "" },
      defaultOgImage: { type: ImageMediaSchema },
    },
    booking: {
      hostTimeZone: { type: String, default: "America/Vancouver" },
      rescheduleNoticeHours: { type: Number, default: 24 },
      holdDurationMinutes: { type: Number, default: 15 },
      eTransferInstructions: { type: String, default: "" },
    },
    payments: {
      defaultCurrency: { type: String, default: "CAD" },
      stripeEnabled: { type: Boolean, default: false },
      eTransferEnabled: { type: Boolean, default: true },
    },
    email: {
      fromName: { type: String, default: "Rayana De Silva — Heart Matters" },
      replyTo: { type: String, default: "" },
    },
    featureFlags: {
      hideShopInNav: { type: Boolean, default: true },
      hideMediaInNav: { type: Boolean, default: true },
      shopEnabled: { type: Boolean, default: false },
      mediaEnabled: { type: Boolean, default: false },
    },
    legalNotices: {
      requiresOwnerReview: { type: Boolean, default: true },
      disclaimerSummary: { type: String, default: "" },
    },
  },
  { timestamps: true },
);


export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
