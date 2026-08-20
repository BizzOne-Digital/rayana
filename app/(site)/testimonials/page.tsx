import type { Metadata } from "next";
import { TestimonialsPageRenderer } from "@/components/testimonials/TestimonialsPageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("testimonials"),
    getPublicSettings(),
  ]);
  return buildMetadata({
    title: page?.title,
    seo: page?.seo,
    settings,
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const [page, context] = await Promise.all([
    getPublicPage("testimonials"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <TestimonialsPageRenderer sections={page.sections} context={context} />;
}
