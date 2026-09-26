import type { Metadata } from "next";
import { TestimonialsPageRenderer } from "@/components/testimonials/TestimonialsPageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildMetadata({ settings, path: "/testimonials" });
}

export default async function TestimonialsPage() {
  const [page, context] = await Promise.all([
    getPublicPage("testimonials"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <TestimonialsPageRenderer sections={page.sections} context={context} />;
}
