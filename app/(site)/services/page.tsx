import type { Metadata } from "next";
import { ServicesPageRenderer } from "@/components/services/ServicesPageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("services"),
    getPublicSettings(),
  ]);
  return buildMetadata({
    title: page?.title,
    seo: page?.seo,
    settings,
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [page, context] = await Promise.all([
    getPublicPage("services"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <ServicesPageRenderer sections={page.sections} context={context} />;
}
