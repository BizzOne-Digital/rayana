"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { BOOK_CONSULTATION_LABEL, RAYANA_FAQS } from "@/lib/data/site-copy";
import type { SectionContext } from "@/lib/sections/registry";
import type { TypedPageSection } from "@/lib/sections/types";

type FaqsPageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

function findSection(sections: TypedPageSection[], id: string) {
  return sections.find((s) => s.id === id);
}

const DEFAULT_FAQS = RAYANA_FAQS;

export function FaqsPageRenderer({ sections, context }: FaqsPageRendererProps) {
  const hero = findSection(sections, "faqs-hero");
  const faqs = context?.faqs?.length ? context.faqs : DEFAULT_FAQS;

  return (
    <div className="mockup-simple-page">
      <section className="mockup-simple-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow">{hero?.eyebrow ?? "Questions You Might Have"}</p>
          <h1 className="mockup-heading mt-3">{hero?.heading ?? "Common Questions"}</h1>
          <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
            Answers to help you find your way forward with clarity.
          </p>
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      <section className="mockup-section mockup-section--light">
        <div className="site-container max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      <section className="mockup-section mockup-section--dark text-center">
        <div className="site-container max-w-xl">
          <h2 className="mockup-heading text-2xl md:text-3xl">Still Have Questions?</h2>
          <p className="mockup-body mt-4 opacity-90">
            Rayana reads every message personally and responds with care.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="mockup-outline-btn">
              Contact Rayana
            </Link>
            <Link href="/booking" className="btn btn-hero-primary">
              {BOOK_CONSULTATION_LABEL}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
