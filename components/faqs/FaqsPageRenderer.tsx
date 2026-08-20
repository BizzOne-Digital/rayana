"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { SectionContext } from "@/lib/sections/registry";
import type { PublicFAQ, TypedPageSection } from "@/lib/sections/types";

type FaqsPageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

function findSection(sections: TypedPageSection[], id: string) {
  return sections.find((s) => s.id === id);
}

const DEFAULT_FAQS: PublicFAQ[] = [
  {
    slug: "how-to-book",
    question: "How do I book a session?",
    answer:
      "Visit the booking page, choose your service and preferred time, and complete the confirmation steps. You'll receive a confirmation email with all the details.",
    category: "Booking",
  },
  {
    slug: "session-format",
    question: "Are sessions in person or online?",
    answer:
      "Both options are available depending on the service. Private sessions can be held in person in Vancouver or via secure video.",
    category: "General",
  },
  {
    slug: "which-service",
    question: "How do I know which offering is right for me?",
    answer:
      "If you're unsure, begin with a private session. Rayana will help you discern the path that meets you where you are.",
    category: "General",
  },
  {
    slug: "session-length",
    question: "How long are sessions?",
    answer:
      "Private sessions are typically 90 minutes. Mentoring and group experiences vary—details are listed on each service page.",
    category: "Sessions",
  },
  {
    slug: "cancellation",
    question: "What is your cancellation policy?",
    answer:
      "Please provide at least 48 hours notice if you need to reschedule or cancel. See the cancellation policy page for full details.",
    category: "Booking",
  },
];

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
              Book a Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
