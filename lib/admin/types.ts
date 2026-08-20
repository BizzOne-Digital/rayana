import type { ImageMedia, PageSection, SEO } from "@/models/shared";

export type IntegrationStatus = "healthy" | "degraded" | "offline" | "unknown";

export type IntegrationHealthItem = {
  key: "mongodb" | "smtp" | "stripe" | "uploads";
  label: string;
  status: IntegrationStatus;
  message?: string;
};

export type DashboardStats = {
  pages: number;
  services: number;
  bookings: {
    total: number;
    pending: number;
    upcoming: number;
    revenue: number;
  };
  submissions: {
    contact: number;
    reviews: number;
    testimonialsPending: number;
  };
  content: {
    blogPosts: number;
    galleryImages: number;
    products: number;
  };
  integrations: IntegrationHealthItem[];
  bookingChart: Array<{ date: string; count: number; revenue: number }>;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminPageSummary = {
  _id: string;
  title: string;
  slug: string;
  systemKey: string;
  route: string;
  status: "draft" | "published";
  showInNavigation: boolean;
  updatedAt: string;
};

export type AdminPageDetail = AdminPageSummary & {
  navigationLabel: string;
  sections: PageSection[];
  seo: SEO;
  revision: number;
};

export type AdminServiceSummary = {
  _id: string;
  title: string;
  slug: string;
  status: "active" | "coming_soon" | "archived";
  featured: boolean;
  bookable: boolean;
  displayOrder: number;
  updatedAt: string;
};

export type AdminBookingRow = {
  _id: string;
  referenceNumber: string;
  serviceTitle: string;
  client: { name: string; email: string };
  startLocal: string;
  status: string;
  payment: { status: string; amount: number; currency: string; method: string };
};

export type MediaAssetRow = {
  _id: string;
  filename: string;
  url: string;
  alt: string;
  mimeType: string;
  bytes: number;
  createdAt: string;
};

export type ImageMediaInput = ImageMedia;
