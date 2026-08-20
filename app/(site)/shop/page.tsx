import type { Metadata } from "next";
import Link from "next/link";
import { PageRenderer } from "@/components/sections/PageRenderer";
import { MediaImage } from "@/components/site/MediaImage";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicProducts, getPublicSettings } from "@/lib/data/public";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("shop"),
    getPublicSettings(),
  ]);
  return buildMetadata({ title: page?.title, seo: page?.seo, settings, path: "/shop" });
}

export default async function ShopPage() {
  const [page, context, products] = await Promise.all([
    getPublicPage("shop"),
    buildSectionContext(),
    getPublicProducts(),
  ]);

  if (!page) return null;

  const placeholders = [
    SEED_IMAGES.texture,
    SEED_IMAGES.teaching,
    SEED_IMAGES.sacred,
    SEED_IMAGES.workshop,
    SEED_IMAGES.nature,
  ];

  return (
    <>
      <PageRenderer sections={page.sections} context={context} />
      <section className="section-padding pt-0">
        <div className="site-container">
          {products.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="editorial-card block overflow-hidden">
                  {product.image ? (
                    <div className="relative aspect-[4/3]">
                      <MediaImage image={product.image} sizes="33vw" />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <h2 className="font-display text-2xl">{product.title}</h2>
                    <p className="mt-2 text-sm text-muted-stone">{product.shortDescription}</p>
                    <p className="mt-4 text-heart-wine">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {placeholders.map((image, index) => (
                <div key={image.url} className={`relative overflow-hidden rounded-2xl shadow-soft aspect-square ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                  <MediaImage image={image} sizes="240px" />
                </div>
              ))}
              <p className="col-span-full mt-4 text-muted-stone">
                Shop offerings are coming soon. Contact Rayana to enquire about current digital offerings.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
