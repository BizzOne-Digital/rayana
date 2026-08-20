import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
