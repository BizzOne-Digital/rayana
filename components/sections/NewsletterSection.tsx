"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TextReveal } from "@/components/animations/TextReveal";
import { RichText } from "@/components/ui/RichText";
import { SectionShell } from "@/components/ui/SectionShell";
import type { SectionProps } from "@/lib/sections/registry";

export function NewsletterSection({ section, context }: SectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const settings = context?.settings;
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Thank you for subscribing.");
      setEmail("");
    } catch {
      toast.success("Thank you — your interest has been noted.");
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  const heading = section.heading || settings?.footer.newsletterHeading || "Stay Connected";

  if (isEditorial) {
    return (
      <section id={section.id} className="home-newsletter border-t border-border/60 py-16 md:py-20">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <TextReveal text={heading} as="h2" className="home-section-heading mb-5" />
            <RichText
              html={section.body || `<p>${settings?.footer.newsletterBody ?? ""}</p>`}
              className="home-body mx-auto mb-8"
            />
            <form
              onSubmit={onSubmit}
              className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="home-newsletter-input min-w-0 flex-1 rounded-full border border-border bg-warm-ivory px-5 py-3.5 text-sm outline-none transition-colors focus:border-heart-wine"
              />
              <button type="submit" disabled={loading} className="btn btn-primary shrink-0">
                {loading ? "Joining…" : "Stay Connected"}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={heading} eyebrow={section.eyebrow} className="bg-parchment">
      <form onSubmit={onSubmit} className="flex max-w-lg flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 rounded-full border px-5 py-3"
        />
        <button type="submit" className="btn btn-primary">
          Subscribe
        </button>
      </form>
    </SectionShell>
  );
}
