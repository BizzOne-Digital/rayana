import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { getPublicProducts, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildMetadata({
    title: "Shop",
    seo: {
      title: "Shop | Rayana De Silva",
      description:
        "Recorded chakra modules to study at your leisure—foundation and advanced pairings.",
    },
    settings,
    path: "/shop",
  });
}

export default async function ShopPage() {
  const [settings, products] = await Promise.all([getPublicSettings(), getPublicProducts()]);
  const currency = settings.payments?.defaultCurrency ?? "CAD";

  if (!settings.featureFlags.shopEnabled) {
    return (
      <div className="mockup-simple-page">
        <section className="mockup-section mockup-section--light py-24 text-center">
          <p className="mockup-body mockup-body--dark">The shop is not available at the moment.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mockup-simple-page">
      <section className="mockup-simple-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <blockquote className="mx-auto max-w-2xl border-0 p-0">
            <p className="font-display text-lg leading-relaxed text-champagne-gold/95 sm:text-xl md:text-2xl">
              Enquire into Thine Own Heart.
            </p>
            <p className="mt-3 font-display text-lg leading-relaxed text-rose-mist/90 sm:text-xl md:text-2xl">
              Know thyself.
            </p>
            <p className="mt-3 font-display text-lg leading-relaxed text-champagne-gold/95 sm:text-xl md:text-2xl">
              And To Thine Own Self Be True.
            </p>
          </blockquote>
          <div className="mockup-ornament mx-auto mt-8 justify-center" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
          <p className="mockup-eyebrow mt-8">Shop</p>
          <h1 className="mockup-heading mt-3">Recorded Teachings</h1>
          <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
            Stand-alone modules for individuals to study at your leisure—each chakra as its own
            journey.
          </p>
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      <ShopCatalog products={products} currency={currency} />
    </div>
  );
}
