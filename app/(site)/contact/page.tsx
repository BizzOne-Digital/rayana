import type { Metadata } from "next";
import { ContactPageRenderer } from "@/components/contact/ContactPageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildMetadata({ settings, path: "/contact" });
}

export default async function ContactPage() {
  const [page, context] = await Promise.all([
    getPublicPage("contact"),
    buildSectionContext(),
  ]);

  if (!page) return null;

  return <ContactPageRenderer sections={page.sections} context={context} />;
}
