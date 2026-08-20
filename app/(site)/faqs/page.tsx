import type { Metadata } from "next";
import { FaqsPageRenderer } from "@/components/faqs/FaqsPageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("faqs"),
    getPublicSettings(),
  ]);
  return buildMetadata({
    title: page?.title,
    seo: page?.seo,
    settings,
    path: "/faqs",
  });
}

export default async function FaqsPage() {
  const [page, context] = await Promise.all([
    getPublicPage("faqs"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <FaqsPageRenderer sections={page.sections} context={context} />;
}
