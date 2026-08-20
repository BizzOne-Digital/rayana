import type { Metadata } from "next";
import { HomePageRenderer } from "@/components/home/HomePageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("home"),
    getPublicSettings(),
  ]);
  return buildMetadata({
    title: page?.title,
    seo: page?.seo,
    settings,
    path: "/",
  });
}

export default async function HomePage() {
  const [page, context] = await Promise.all([
    getPublicPage("home"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <HomePageRenderer sections={page.sections} context={context} />;
}
