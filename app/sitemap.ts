import type { MetadataRoute } from "next";
import { getPublicBlogPosts, getPublicPages, getPublicServices } from "@/lib/data/public";
import { getSiteBaseUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteBaseUrl();
  const [pages, services, posts] = await Promise.all([
    getPublicPages(),
    getPublicServices(),
    getPublicBlogPosts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = pages
    .filter((page) => page.systemKey !== "services")
    .map((page) => ({
    url: `${base}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.systemKey === "home" ? "weekly" : "monthly",
    priority: page.systemKey === "home" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
