"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BOOK_CONSULTATION_LABEL, RAYANA_TESTIMONIALS } from "@/lib/data/site-copy";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import type { SectionContext } from "@/lib/sections/registry";
import type { TypedPageSection } from "@/lib/sections/types";

type TestimonialsPageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

function findSection(sections: TypedPageSection[], id: string) {
  return sections.find((s) => s.id === id);
}

const DEFAULT_TESTIMONIALS = RAYANA_TESTIMONIALS;

export function TestimonialsPageRenderer({ sections, context }: TestimonialsPageRendererProps) {
  const hero = findSection(sections, "testimonials-hero");
  const testimonials = context?.testimonials?.length
    ? context.testimonials
    : DEFAULT_TESTIMONIALS;

  return (
    <div className="mockup-simple-page">
      <section className="mockup-simple-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow">{hero?.eyebrow ?? "Kind Words"}</p>
          <h1 className="mockup-heading mt-3">{hero?.heading ?? "From the Heart"}</h1>
          <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
            Reflections from those who have worked with Rayana.
          </p>
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      <section className="mockup-section mockup-section--light">
        <div className="site-container">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.slug} className="mockup-simple-card">
                <blockquote className="mockup-testimonial-quote mockup-testimonial-quote--dark">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-champagne-gold/25">
                    <Image
                      src={SEED_IMAGES.portrait1.url}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-velvet-night">{item.name}</p>
                    {item.role ? <p className="text-xs text-muted-stone">{item.role}</p> : null}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mockup-section mockup-section--dark text-center">
        <div className="site-container max-w-xl">
          <h2 className="mockup-heading text-2xl md:text-3xl">Ready to Begin?</h2>
          <p className="mockup-body mt-4 opacity-90">
            Book a session or share your own reflection with Rayana.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/booking" className="btn btn-hero-primary">
              {BOOK_CONSULTATION_LABEL}
            </Link>
            <Link href="/write-a-review" className="mockup-outline-btn">
              Write a Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
