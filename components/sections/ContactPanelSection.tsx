import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { ContactForm } from "@/components/forms/ContactForm";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { SectionShell } from "@/components/ui/SectionShell";
import { SiteButtons } from "@/components/ui/SiteButton";
import type { SectionProps } from "@/lib/sections/registry";

export function ContactPanelSection({ section, context }: SectionProps) {
  const settings = context?.settings;
  const showForm = section.settings?.showForm;
  const showReviewForm = section.settings?.showReviewForm;
  const showWhatsApp = section.settings?.showWhatsApp;
  const [imageA, imageB] = section.images ?? [];

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <ScrollReveal>
          <div className="rounded-[2rem] border border-border bg-surface-elevated p-8">
            <p className="eyebrow mb-4">Reach Out</p>
            {settings?.contact.email ? (
              <p className="mb-2">
                <a href={`mailto:${settings.contact.email}`} className="text-heart-wine hover:underline">
                  {settings.contact.email}
                </a>
              </p>
            ) : null}
            {settings?.contact.displayPhone ? (
              <p className="mb-2">{settings.contact.displayPhone}</p>
            ) : null}
            {settings?.contact.location ? <p className="mb-4">{settings.contact.location}</p> : null}
            {showWhatsApp && settings?.contact.whatsApp ? (
              <a
                href={`https://wa.me/${settings.contact.whatsApp.replace(/\D/g, "")}`}
                className="btn btn-secondary inline-flex"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            ) : null}
            {settings?.contact.responseTimeNote ? (
              <p className="mt-6 text-sm text-muted-stone">{settings.contact.responseTimeNote}</p>
            ) : null}
            <SiteButtons buttons={section.buttons} className="mt-6" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {showReviewForm ? (
            <ReviewForm />
          ) : showForm ? (
            <ContactForm />
          ) : (
            <div className="grid gap-4">
              {imageA ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                  <MediaImage image={imageA} sizes="(max-width: 1024px) 100vw, 45vw" />
                </div>
              ) : null}
              {imageB ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft">
                  <MediaImage image={imageB} sizes="(max-width: 1024px) 100vw, 45vw" />
                </div>
              ) : null}
            </div>
          )}
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}
