import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/site/MediaImage";
import { getPublicProduct, getPublicProducts, getPublicSettings } from "@/lib/data/public";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCurrency } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getPublicProduct(slug),
    getPublicSettings(),
  ]);
  if (!product) return {};
  return buildMetadata({
    title: product.title,
    description: product.shortDescription,
    settings,
    path: `/shop/${slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getPublicProduct(slug),
    getPublicSettings(),
  ]);

  if (!product) notFound();

  const gallery = [
    product.image ?? SEED_IMAGES.texture,
    SEED_IMAGES.teaching,
    SEED_IMAGES.sacred,
    SEED_IMAGES.workshop,
    SEED_IMAGES.nature,
  ];

  return (
    <article>
      <section className="section-padding">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="eyebrow mb-4">Shop</p>
            <h1 className="display-heading text-4xl md:text-5xl">{product.title}</h1>
            <p className="mt-4 text-lg text-muted-stone">{product.shortDescription}</p>
            <p className="mt-6 font-display text-4xl text-heart-wine">
              {formatCurrency(product.price, product.currency || settings.payments?.defaultCurrency || "CAD")}
            </p>
            <Link
              href={`/contact?interest=${encodeURIComponent(product.slug)}`}
              className="btn btn-primary mt-8 inline-flex"
            >
              {product.price > 0 ? "Purchase" : "Get Free Sample"}
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
            <MediaImage image={gallery[0]} priority sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="site-container grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.slice(1).map((image) => (
            <div key={image.url} className="relative aspect-square overflow-hidden rounded-2xl shadow-soft">
              <MediaImage image={image} sizes="240px" />
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}
