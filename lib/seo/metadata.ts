import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import type { PublicSettings } from "@/lib/sections/types";
import {
  getPageSeoFallback,
  mergeKeywords,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_KEYWORDS,
} from "@/lib/seo/site-seo";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rayanaheartmatters.vercel.app";

type MetadataInput = {
  /** Visible content title (e.g. blog post title) — not edited in admin as SEO. */
  title?: string;
  description?: string;
  settings?: PublicSettings;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
  openGraphType?: "website" | "article";
  ogImage?: string;
};

function formatTitle(
  resolvedTitle: string,
  brandName: string,
  path: string,
): string | { default: string; template: string } {
  const fullBrand = brandName || SITE_NAME;
  if (path === "/" || resolvedTitle.includes(fullBrand)) {
    return resolvedTitle;
  }
  return `${resolvedTitle} | ${fullBrand}`;
}

export function buildMetadata({
  title,
  description,
  settings,
  path = "",
  noIndex,
  keywords,
  openGraphType = "website",
  ogImage: ogImageOverride,
}: MetadataInput): Metadata {
  const fallback = getPageSeoFallback(path);
  const brandName = settings?.brand.name ?? SITE_NAME;

  const resolvedTitle =
    title?.trim() || fallback?.title || SITE_NAME;

  const resolvedDescription =
    description?.trim() ||
    fallback?.description ||
    settings?.brand.tagline ||
    SITE_DEFAULT_DESCRIPTION;

  const resolvedKeywords = mergeKeywords(
    keywords,
    fallback?.keywords,
    SITE_DEFAULT_KEYWORDS,
  );

  const ogImage =
    ogImageOverride ||
    settings?.seo.defaultOgImage?.url ||
    "/images/seed/portrait-1.svg";

  const canonical = `${BASE_URL}${path}`;
  const formattedTitle = formatTitle(resolvedTitle, brandName, path);
  const shouldIndex = !noIndex;

  return {
    title: formattedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    authors: [{ name: "Rayana De Silva", url: `${BASE_URL}/about` }],
    creator: "Rayana De Silva",
    publisher: brandName,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: brandName,
      images: [{ url: ogImage, alt: resolvedTitle }],
      locale: "en_CA",
      type: openGraphType,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getSiteBaseUrl(): string {
  return BASE_URL;
}
