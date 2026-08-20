"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SectionShell } from "@/components/ui/SectionShell";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import { clearGsapInlineStyles, ensureTweenVisible, refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionProps } from "@/lib/sections/registry";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServiceShowcaseSection({ section, context }: SectionProps) {
  const settings = section.settings ?? {};
  let services = context?.services ?? [];
  const gridRef = useRef<HTMLDivElement>(null);

  if (settings.featuredOnly) {
    services = services.filter((s) => s.featured);
  }
  if (settings.limit) {
    services = services.slice(0, settings.limit);
  }

  const accent = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  useEffect(() => {
    if (!isEditorial || !gridRef.current || prefersReducedMotion()) return;

    const cards = gridRef.current.querySelectorAll(".home-service-card");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        cards,
        { opacity: 0, y: 50, rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
          },
        },
      );

      requestAnimationFrame(() => {
        refreshScrollTriggers();
        ensureTweenVisible(gridRef.current, tween);
      });
    }, gridRef);

    return () => {
      ctx.revert();
      clearGsapInlineStyles(cards);
    };
  }, [isEditorial, services.length]);

  if (isEditorial) {
    return (
      <section id={section.id} className="home-services section-padding texture-parchment texture-grain">
        <div className="site-container">
          {section.eyebrow ? <p className="home-eyebrow-dark mb-5">{section.eyebrow}</p> : null}
          <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading mb-4" />
          <RichText html={section.body} className="home-body mb-12 max-w-2xl" />

          <div ref={gridRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.slug}
                className="home-service-card group overflow-hidden rounded-[1.5rem] border border-champagne-gold/15 bg-warm-ivory/80 shadow-soft backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2 hover:border-champagne-gold/35 hover:shadow-[0_24px_60px_-24px_rgba(78,5,5,0.35)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <MediaImage
                    image={service.mainImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    imageClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="home-image-vignette absolute inset-0 opacity-60" />
                </div>
                <div className="p-6 md:p-7">
                  {service.badge ? (
                    <span className="home-eyebrow-dark mb-2 block text-[0.58rem]">{service.badge}</span>
                  ) : null}
                  <h3 className="font-display text-2xl text-velvet-night transition-colors group-hover:text-heart-wine">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-stone">
                    {service.shortDescription}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                    <span className="font-display text-lg text-heart-wine">{service.pricePreview}</span>
                    <Link
                      href={service.cardCta.href || `/services/${service.slug}`}
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-plum transition-colors hover:text-heart-wine"
                    >
                      {service.cardCta.label} →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {accent ? (
            <div className="relative mt-12 aspect-[21/8] overflow-hidden rounded-[1.5rem]">
              <MediaImage image={accent} sizes="100vw" className="absolute inset-0 h-full w-full" />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <RichText html={section.body} className="mb-10 max-w-2xl" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service.slug} className="editorial-card group h-full">
            <div className="relative aspect-[4/3] overflow-hidden">
              <MediaImage image={service.mainImage} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl text-velvet-night">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-stone">{service.shortDescription}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
