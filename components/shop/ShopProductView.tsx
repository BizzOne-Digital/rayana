import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ShopPurchaseButton } from "@/components/shop/ShopPurchaseButton";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { shopProductTier } from "@/lib/data/shop-catalog";
import type { PublicProduct, PublicSettings } from "@/lib/sections/types";
import { formatCurrency } from "@/lib/utils";

type ShopProductViewProps = {
  product: PublicProduct;
  settings: PublicSettings;
};

export function ShopProductView({ product, settings }: ShopProductViewProps) {
  const tier = shopProductTier(product.slug);
  const currency = product.currency || settings.payments?.defaultCurrency || "CAD";
  const isFree = product.price === 0;
  return (
    <article className="mockup-simple-page">
      <section className="mockup-simple-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-rose-mist/75 transition-colors hover:text-champagne-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to Shop
          </Link>
          {tier ? (
            <p className="mockup-eyebrow mt-6">
              {tier === "foundation" ? "Level 1 · In-Body" : "Level 2 · Paired Chakras"}
            </p>
          ) : null}
          <h1 className="mockup-heading mt-3">{product.title}</h1>
          <p className="mockup-body mx-auto mt-4 max-w-xl text-lg opacity-90">
            {product.shortDescription}
          </p>
          <p className="mt-4 font-display text-xl text-champagne-gold">
            {isFree ? "Free to sample" : formatCurrency(product.price, currency)}
          </p>
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      <section className="mockup-section mockup-section--light">
        <div className="site-container grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {product.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.22)]">
              <MediaImage
                image={product.image}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : null}
          <div className={product.image ? "" : "lg:col-span-2"}>
            <div className="prose-shop mockup-body mockup-body--dark max-w-none text-base leading-relaxed">
              <RichText html={product.description} />
            </div>
            <div className="mt-10">
              <ShopPurchaseButton
                productSlug={product.slug}
                productTitle={product.title}
                price={product.price}
                isFree={isFree}
              />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
