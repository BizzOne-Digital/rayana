import type { Metadata } from "next";
import { PageRenderer } from "@/components/sections/PageRenderer";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("shop"),
    getPublicSettings(),
  ]);
  return buildMetadata({ title: page?.title, seo: page?.seo, settings, path: "/shop" });
}

export default async function ShopPage() {
  const [page, context, settings] = await Promise.all([
    getPublicPage("shop"),
    buildSectionContext(),
    getPublicSettings(),
  ]);

  if (!page) return null;

  const currency = settings.payments?.defaultCurrency ?? "CAD";

  return (
    <>
      <PageRenderer sections={page.sections} context={context} />
      <ShopCatalog currency={currency} />
    </>
  );
}
