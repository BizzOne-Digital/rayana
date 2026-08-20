import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { RichText } from "@/components/ui/RichText";
import type { SectionProps } from "@/lib/sections/registry";

export function FaqPreviewSection({ section, context }: SectionProps) {
  const settings = section.settings ?? {};
  let faqs = context?.faqs ?? [];
  if (settings.category) {
    faqs = faqs.filter((f) => f.category === settings.category);
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <ScrollReveal key={faq.slug} delay={index * 0.05}>
            <details className="group rounded-2xl border border-border bg-warm-ivory p-5 open:bg-surface-elevated">
              <summary className="cursor-pointer list-none font-display text-lg text-velvet-night marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-champagne-gold transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <div className="mt-4 text-sm text-muted-stone">
                {faq.answer.startsWith("<") ? (
                  <RichText html={faq.answer} className="!text-sm" />
                ) : (
                  <p>{faq.answer}</p>
                )}
              </div>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}
