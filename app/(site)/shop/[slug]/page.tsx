import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopProductView } from "@/components/shop/ShopProductView";
import { getPublicProduct, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getPublicSettings(), getPublicProduct(slug)]);
  if (!product) {
    return buildMetadata({
      title: "Shop",
      seo: { title: "Shop | Rayana De Silva", description: "" },
      settings,
      path: "/shop",
    });
  }
  return buildMetadata({
    title: product.title,
    seo: {
      title: `${product.title} | Shop`,
      description: product.shortDescription,
    },
    settings,
    path: `/shop/${slug}`,
  });
}

export default async function ShopProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getPublicSettings(), getPublicProduct(slug)]);

  if (!settings.featureFlags.shopEnabled || !product) {
    notFound();
  }

  return <ShopProductView product={product} settings={settings} />;
}
