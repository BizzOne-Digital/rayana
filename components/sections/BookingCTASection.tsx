import { ClipReveal } from "@/components/animations/ClipReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import type { SectionProps } from "@/lib/sections/registry";

export function BookingCTASection({ section }: SectionProps) {
  const image = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (isEditorial) {
    return (
      <section id={section.id} className="section-padding">
        <div className="site-container">
          <ClipReveal direction="up">
            <div className="home-booking-cta relative overflow-hidden rounded-[2rem] px-8 py-14 md:px-14 md:py-20">
              <div className="home-booking-cta-bg texture-grain absolute inset-0" />
              <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                  {section.eyebrow ? (
                    <p className="home-eyebrow mb-4 text-[0.58rem]">{section.eyebrow}</p>
                  ) : null}
                  <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading-light" />
                  <RichText html={section.body} className="home-manifesto-body mt-6 max-w-xl" />
                  <SiteButtons buttons={section.buttons} className="mt-9" variant="hero" />
                </div>
                {image ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-champagne-gold/20">
                    <MediaImage image={image} sizes="(max-width: 1024px) 100vw, 40vw" />
                  </div>
                ) : null}
              </div>
            </div>
          </ClipReveal>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className="section-padding">
      <div className="site-container">
        <div className="rounded-[2rem] bg-deep-burgundy px-8 py-12 text-warm-ivory md:px-12 md:py-16">
          <h2 className="font-display text-3xl md:text-4xl">{section.heading}</h2>
          <SiteButtons buttons={section.buttons} className="mt-8" />
        </div>
      </div>
    </section>
  );
}
