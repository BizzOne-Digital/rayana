"use client";

import Link from "next/link";
import { BOOK_CONSULTATION_LABEL } from "@/lib/data/site-copy";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import type { SectionContext } from "@/lib/sections/registry";
import type { TypedPageSection } from "@/lib/sections/types";

type ContactPageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

function findSection(sections: TypedPageSection[], id: string) {
  return sections.find((s) => s.id === id);
}

export function ContactPageRenderer({ sections, context }: ContactPageRendererProps) {
  const hero = findSection(sections, "contact-hero");
  const contact = context?.settings?.contact;

  return (
    <div className="mockup-simple-page">
      <section className="mockup-simple-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow">{hero?.eyebrow ?? "Reach Out"}</p>
          <h1 className="mockup-heading mt-3">{hero?.heading ?? "Get in Touch"}</h1>
          <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
            Questions, session requests, or reflections—you are welcome to connect.
          </p>
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      <section className="mockup-section mockup-section--light">
        <div className="site-container mockup-contact-grid">
          <div className="mockup-simple-card">
            <p className="mockup-eyebrow mockup-eyebrow--dark mb-6">Contact Details</p>
            <ul className="space-y-5">
              {contact?.email ? (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#7e1638]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-stone">
                      Email
                    </p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block text-velvet-night hover:text-heart-wine"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>
              ) : null}
              {contact?.displayPhone ? (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#7e1638]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-stone">
                      Phone
                    </p>
                    <a
                      href={`tel:${contact.e164Phone || contact.displayPhone}`}
                      className="mt-1 block text-velvet-night hover:text-heart-wine"
                    >
                      {contact.displayPhone}
                    </a>
                  </div>
                </li>
              ) : null}
              {contact?.location ? (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#7e1638]" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-stone">
                      Location
                    </p>
                    <p className="mt-1 text-velvet-night">{contact.location}</p>
                  </div>
                </li>
              ) : null}
            </ul>
            {contact?.responseTimeNote ? (
              <p className="mockup-body mockup-body--dark mt-8 text-sm">{contact.responseTimeNote}</p>
            ) : null}
            {contact?.whatsApp ? (
              <a
                href={`https://wa.me/${contact.whatsApp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mockup-outline-btn mockup-outline-btn--dark mt-6 inline-flex"
              >
                Message on WhatsApp
              </a>
            ) : null}
            <Link href="/booking" className="btn btn-primary mt-4 inline-flex">
              {BOOK_CONSULTATION_LABEL}
            </Link>
          </div>

          <ContactForm className="mockup-simple-card !bg-white !p-6 md:!p-8" />
        </div>
      </section>
    </div>
  );
}
