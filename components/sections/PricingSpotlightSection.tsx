import Link from "next/link";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { formatCurrency } from "@/lib/utils";
import { SectionShell } from "@/components/ui/SectionShell";
import type { SectionProps } from "@/lib/sections/registry";

export function PricingSpotlightSection({ section, context }: SectionProps) {
  const settings = section.settings ?? {};
  let plans = context?.pricingPlans ?? [];

  if (settings.planSlug) {
    plans = plans.filter((p) => p.slug === settings.planSlug);
  } else if (!settings.showAll) {
    plans = plans.filter((p) => p.featured);
  }

  const accent = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (isEditorial) {
    return (
      <section id={section.id} className="home-pricing relative overflow-hidden py-20 md:py-28">
        <div className="home-pricing-bg texture-grain absolute inset-0" />
        <div className="site-container relative z-10">
          {section.eyebrow ? <p className="home-eyebrow mb-5">{section.eyebrow}</p> : null}
          <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading-light mb-6" />
          <RichText html={section.body} className="home-manifesto-body mb-12 max-w-2xl" />

          <div className="grid gap-8 lg:grid-cols-2">
            {plans.map((plan) => (
              <ClipReveal key={plan.slug} direction="up">
                <article className="home-pricing-card overflow-hidden rounded-[1.75rem] border border-champagne-gold/20 bg-[#4e0505]/40 p-8 backdrop-blur-md md:p-10">
                  {plan.image ? (
                    <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-xl">
                      <MediaImage image={plan.image} sizes="(max-width: 1024px) 100vw, 50vw" />
                    </div>
                  ) : null}
                  {plan.badge ? (
                    <p className="home-eyebrow mb-3 text-[0.58rem]">{plan.badge}</p>
                  ) : null}
                  <h3 className="font-display text-3xl text-warm-ivory md:text-4xl">{plan.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-rose-mist/85">{plan.description}</p>
                  <p className="mt-6 font-display text-4xl text-champagne-gold md:text-5xl">
                    {formatCurrency(plan.salePrice ?? plan.price, plan.currency)}
                  </p>
                  <ul className="mt-8 space-y-3 text-sm text-warm-ivory/88">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="text-champagne-gold">◆</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaHref} className="btn btn-hero-primary mt-10 inline-flex">
                    {plan.ctaLabel}
                  </Link>
                </article>
              </ClipReveal>
            ))}
          </div>

          {accent ? (
            <div className="relative mt-10 aspect-[21/7] overflow-hidden rounded-[1.5rem] opacity-90">
              <MediaImage image={accent} sizes="100vw" />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow} className="texture-parchment">
      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.slug} className="editorial-card overflow-hidden p-8">
            <h3 className="font-display text-3xl text-velvet-night">{plan.title}</h3>
            <Link href={plan.ctaHref} className="btn btn-primary mt-8 inline-flex">
              {plan.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
