import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import type { PublicSettings } from "@/lib/sections/types";
import type { SEO } from "@/models/shared";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://heartmatters.com";

type MetadataInput = {
  title?: string;
  description?: string;
  seo?: SEO;
  settings?: PublicSettings;
  path?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  seo,
  settings,
  path = "",
  noIndex,
}: MetadataInput): Metadata {
  const resolvedTitle =
    seo?.title ||
    title ||
    settings?.seo.defaultTitle ||
    SITE_NAME;
  const resolvedDescription =
    seo?.description ||
    description ||
    settings?.seo.defaultDescription ||
    settings?.brand.tagline ||
    "";

  const ogImage =
    seo?.ogImage?.url ||
    settings?.seo.defaultOgImage?.url ||
    "/images/seed/portrait-1.svg";

  const canonical = seo?.canonicalUrl || `${BASE_URL}${path}`;

  return {
    title: resolvedTitle.includes(SITE_NAME)
      ? resolvedTitle
      : `${resolvedTitle} | ${settings?.brand.name ?? SITE_NAME}`,
    description: resolvedDescription,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical },
    openGraph: {
      title: seo?.ogTitle || resolvedTitle,
      description: seo?.ogDescription || resolvedDescription,
      url: canonical,
      siteName: settings?.brand.name ?? SITE_NAME,
      images: [{ url: ogImage, alt: seo?.ogImage?.alt ?? resolvedTitle }],
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || resolvedTitle,
      description: seo?.ogDescription || resolvedDescription,
      images: [ogImage],
    },
    robots: {
      index: !(noIndex ?? seo?.noIndex),
      follow: !(noIndex ?? seo?.noIndex),
    },
  };
}

export function getSiteBaseUrl(): string {
  return BASE_URL;
}
