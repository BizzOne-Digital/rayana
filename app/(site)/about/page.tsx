import type { Metadata } from "next";
import { AboutPageRenderer } from "@/components/about/AboutPageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("about"),
    getPublicSettings(),
  ]);
  return buildMetadata({
    title: page?.title,
    seo: page?.seo,
    settings,
    path: "/about",
  });
}

export default async function AboutPage() {
  const [page, context] = await Promise.all([
    getPublicPage("about"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <AboutPageRenderer sections={page.sections} context={context} />;
}
