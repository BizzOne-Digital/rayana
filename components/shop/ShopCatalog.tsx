import {
  SHOP_FOUNDATION_NOTE,
  SHOP_FOUNDATION_SUBTITLE,
  SHOP_FOUNDATION_TITLE,
  SHOP_INTRO,
  SHOP_OUT_OF_BODY_NOTE,
  SHOP_OUT_OF_BODY_SUBTITLE,
  SHOP_OUT_OF_BODY_TITLE,
  partitionPublishedProducts,
} from "@/lib/data/shop-catalog";
import type { PublicProduct } from "@/lib/sections/types";
import { ShopModuleCard } from "@/components/shop/ShopModuleCard";
import { Sparkles } from "lucide-react";

type ShopCatalogProps = {
  products: PublicProduct[];
  currency?: string;
};

function ModuleSection({
  eyebrow,
  title,
  subtitle,
  note,
  items,
  currency = "CAD",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  note: string;
  items: PublicProduct[];
  currency?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-16 md:mt-20">
      <p className="mockup-eyebrow mockup-eyebrow--dark">{eyebrow}</p>
      <h2 className="mockup-heading mockup-heading--dark mt-2 text-2xl md:text-3xl">{title}</h2>
      <p className="mt-2 font-display text-lg text-[#4e0505]/85">{subtitle}</p>
      <p className="mockup-body mockup-body--dark mt-2 text-sm opacity-90">{note}</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ShopModuleCard
            key={item.slug}
            slug={item.slug}
            title={item.title}
            tagline={item.shortDescription}
            price={item.price}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}

export function ShopCatalog({ products, currency = "CAD" }: ShopCatalogProps) {
  const { foundation, outOfBody } = partitionPublishedProducts(products);

  return (
    <section className="mockup-section mockup-section--light pb-20">
      <div className="site-container max-w-6xl">
        <p className="mockup-body mockup-body--dark mx-auto max-w-3xl text-center text-base leading-relaxed md:text-lg">
          {SHOP_INTRO}
        </p>

        <ModuleSection
          eyebrow="Level 1"
          title={SHOP_FOUNDATION_TITLE}
          subtitle={SHOP_FOUNDATION_SUBTITLE}
          note={SHOP_FOUNDATION_NOTE}
          items={foundation}
          currency={currency}
        />

        <ModuleSection
          eyebrow="Level 2"
          title={SHOP_OUT_OF_BODY_TITLE}
          subtitle={SHOP_OUT_OF_BODY_SUBTITLE}
          note={SHOP_OUT_OF_BODY_NOTE}
          items={outOfBody}
          currency={currency}
        />

        <div className="relative mt-20 overflow-hidden rounded-[1.5rem] border border-[#d4af37]/35 bg-gradient-to-br from-[#4e0505] via-[#5c0a1a] to-[#26020d] px-8 py-12 text-center text-rose-mist shadow-[0_32px_80px_-32px_rgba(38,2,13,0.55)] md:px-12">
          <div className="mockup-ornament mx-auto justify-center" aria-hidden>
            <span className="mockup-ornament-line bg-champagne-gold/30" />
            <Sparkles className="mockup-ornament-icon h-4 w-4 text-champagne-gold" />
            <span className="mockup-ornament-line bg-champagne-gold/30" />
          </div>
          <p className="mockup-eyebrow mt-4 text-champagne-gold/90">Coming Soon</p>
          <h3 className="mockup-heading mt-3 text-2xl md:text-3xl">Guides, Beings & Spirits</h3>
          <p className="mockup-body mx-auto mt-4 max-w-lg text-sm opacity-90">
            Additional recorded teachings on guides, beings, and spirits will be added here.
          </p>
        </div>
      </div>
    </section>
  );
}
