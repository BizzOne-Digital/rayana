"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import type { PublicFAQ } from "@/lib/sections/types";

type FaqAccordionProps = {
  faqs: PublicFAQ[];
  dark?: boolean;
};

export function FaqAccordion({ faqs, dark = false }: FaqAccordionProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(faqs[0]?.slug ?? null);

  if (!faqs.length) {
    return <p className={dark ? "text-rose-mist/80" : "text-muted-stone"}>No questions yet.</p>;
  }

  return (
    <div className={`mockup-faq-list ${dark ? "mockup-faq-list--dark" : ""}`}>
      {faqs.map((faq) => {
        const open = openSlug === faq.slug;
        return (
          <div key={faq.slug} className="mockup-faq-item">
            <button
              type="button"
              className="mockup-faq-trigger"
              aria-expanded={open}
              onClick={() => setOpenSlug(open ? null : faq.slug)}
            >
              <span>{faq.question}</span>
              {open ? (
                <ChevronDown className="h-4 w-4 shrink-0 rotate-180 transition-transform" />
              ) : (
                <Plus className="h-4 w-4 shrink-0" />
              )}
            </button>
            {open ? <div className="mockup-faq-panel">{faq.answer}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
