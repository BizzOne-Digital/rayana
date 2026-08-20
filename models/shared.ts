import { Schema } from "mongoose";

export const ImageMediaSchema = new Schema(
  {
    assetId: { type: String, default: "" },
    url: { type: String, required: true },
    width: { type: Number, default: 1200 },
    height: { type: Number, default: 800 },
    mimeType: { type: String, default: "image/svg+xml" },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    focalPoint: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.5 },
    },
    decorative: { type: Boolean, default: false },
    credit: { type: String, default: "" },
  },
  { _id: false },
);

export const ButtonSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    variant: {
      type: String,
      enum: ["primary", "secondary", "ghost", "link"],
      default: "primary",
    },
    openInNewTab: { type: Boolean, default: false },
  },
  { _id: false },
);

export const SEOSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: ImageMediaSchema, default: undefined },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);

export const PageSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    eyebrow: { type: String, default: "" },
    heading: { type: String, default: "" },
    body: { type: String, default: "" },
    buttons: { type: [ButtonSchema], default: [] },
    images: { type: [ImageMediaSchema], default: [] },
    layoutVariant: { type: String, default: "default" },
    themeVariant: { type: String, default: "default" },
    items: { type: [Schema.Types.Mixed], default: [] },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

export type ImageMedia = {
  assetId?: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
  alt?: string;
  caption?: string;
  focalPoint?: { x: number; y: number };
  decorative?: boolean;
  credit?: string;
};

export type Button = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "link";
  openInNewTab?: boolean;
};

export type SEO = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: ImageMedia;
  noIndex?: boolean;
};

export type PageSection = {
  id: string;
  type: string;
  label?: string;
  enabled?: boolean;
  order?: number;
  eyebrow?: string;
  heading?: string;
  body?: string;
  buttons?: Button[];
  images?: ImageMedia[];
  layoutVariant?: string;
  themeVariant?: string;
  items?: unknown[];
  settings?: Record<string, unknown>;
};
