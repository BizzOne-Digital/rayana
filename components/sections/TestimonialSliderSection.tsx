"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import type { SectionProps } from "@/lib/sections/registry";

export function TestimonialSliderSection({ section, context }: SectionProps) {
  const settings = section.settings ?? {};
  let testimonials = context?.testimonials ?? [];
  if (settings.featuredOnly) {
    testimonials = testimonials.filter((t) => t.featured);
  }
  if (settings.limit) {
    testimonials = testimonials.slice(0, settings.limit);
  }

  const [index, setIndex] = useState(0);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const current = testimonials[index];
  const image = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  useEffect(() => {
    if (!quoteRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 20, rotateX: 6 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.65, ease: "power3.out" },
    );
  }, [index]);

  if (!current) return null;

  if (isEditorial) {
    return (
      <section id={section.id} className="home-testimonials section-padding">
        <div className="site-container">
          {section.eyebrow ? <p className="home-eyebrow-dark mb-5">{section.eyebrow}</p> : null}
          <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading mb-12" />

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <figure className="home-testimonial-card relative overflow-hidden rounded-[2rem] border border-champagne-gold/15 bg-warm-ivory p-8 shadow-soft md:p-12">
              <div className="home-testimonial-glow pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-champagne-gold/10 blur-3xl" />
              <blockquote
                ref={quoteRef}
                className="relative font-display text-2xl leading-snug text-velvet-night md:text-[1.75rem] lg:text-3xl"
              >
                “{current.quote}”
              </blockquote>
              <figcaption className="relative mt-8 text-sm text-muted-stone">
                — {current.showFullName ? current.name : current.name.split(" ")[0] || "Client"}
                {current.role ? `, ${current.role}` : ""}
              </figcaption>
              <div className="relative mt-8 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  className="home-testimonial-nav"
                  onClick={() =>
                    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-8 bg-heart-wine" : "w-1.5 bg-border"
                      }`}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  className="home-testimonial-nav"
                  onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </figure>

            {image ? (
              <ClipReveal direction="right" className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <MediaImage image={image} sizes="(max-width: 1024px) 100vw, 40vw" />
              </ClipReveal>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <figure className="rounded-[2rem] border border-border bg-surface-elevated p-8">
        <blockquote className="font-display text-2xl text-velvet-night">“{current.quote}”</blockquote>
      </figure>
    </SectionShell>
  );
}
