import Link from "next/link";
import {
  SHOP_FOUNDATION_NOTE,
  SHOP_FOUNDATION_PRODUCTS,
  SHOP_FOUNDATION_TITLE,
  SHOP_INTRO,
  SHOP_OUT_OF_BODY_NOTE,
  SHOP_OUT_OF_BODY_PRODUCTS,
  SHOP_OUT_OF_BODY_TITLE,
} from "@/lib/data/shop-catalog";
import { formatCurrency } from "@/lib/utils";

type ShopCatalogProps = {
  currency?: string;
};

function ModuleSection({
  title,
  note,
  items,
  currency = "CAD",
}: {
  title: string;
  note: string;
  items: typeof SHOP_FOUNDATION_PRODUCTS;
  currency?: string;
}) {
  return (
    <div className="mt-14">
      <h2 className="mockup-heading mockup-heading--dark text-2xl md:text-3xl">{title}</h2>
      <p className="mockup-body mockup-body--dark mt-2 text-sm opacity-90">{note}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/shop/${item.slug}`}
            className="rounded-[1rem] border border-[#e8dfd2] bg-white px-5 py-5 transition-colors hover:border-[#7e1638]/30 hover:bg-[#faf7f2]"
          >
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7e1638]">
              {item.price === 0 ? "Free" : formatCurrency(item.price, currency)}
            </p>
            <p className="mt-2 font-display text-lg text-velvet-night">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ShopCatalog({ currency = "CAD" }: ShopCatalogProps) {
  return (
    <section className="mockup-section mockup-section--light">
      <div className="site-container max-w-5xl">
        <p className="mockup-body mockup-body--dark max-w-3xl text-base leading-relaxed">
          {SHOP_INTRO}
        </p>

        <ModuleSection
          title={SHOP_FOUNDATION_TITLE}
          note={SHOP_FOUNDATION_NOTE}
          items={SHOP_FOUNDATION_PRODUCTS}
          currency={currency}
        />

        <ModuleSection
          title={SHOP_OUT_OF_BODY_TITLE}
          note={SHOP_OUT_OF_BODY_NOTE}
          items={SHOP_OUT_OF_BODY_PRODUCTS}
          currency={currency}
        />

        <div className="mt-14 rounded-[1.25rem] border border-dashed border-[#d4af37]/40 bg-[#faf7f2] px-6 py-8 text-center">
          <p className="mockup-eyebrow mockup-eyebrow--dark">Coming Soon</p>
          <h3 className="mockup-heading mockup-heading--dark mt-2 text-xl">Guides, Beings & Spirits</h3>
          <p className="mockup-body mockup-body--dark mx-auto mt-3 max-w-lg text-sm">
            Additional recorded teachings on guides, beings, and spirits will be added here.
          </p>
        </div>
      </div>
    </section>
  );
}
