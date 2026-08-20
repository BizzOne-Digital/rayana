import { ClipReveal } from "@/components/animations/ClipReveal";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import type { NumberedStepItem } from "@/lib/sections/types";
import type { SectionProps } from "@/lib/sections/registry";

export function NumberedStepsSection({ section }: SectionProps) {
  const items = (section.items ?? []) as NumberedStepItem[];
  const image = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (isEditorial) {
    return (
      <section id={section.id} className="home-method section-padding">
        <div className="site-container">
          <div className="mb-12 max-w-3xl">
            {section.eyebrow ? <p className="home-eyebrow-dark mb-5">{section.eyebrow}</p> : null}
            <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading" />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <StaggerReveal className="relative space-y-0" stagger={0.12}>
              <div className="home-method-line absolute top-8 bottom-8 left-[1.35rem] hidden w-px bg-gradient-to-b from-champagne-gold/60 via-champagne-gold/20 to-transparent md:block" />
              {items.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="home-method-step relative grid grid-cols-[auto_1fr] gap-5 py-6 md:gap-8 md:py-8"
                >
                  <span className="home-method-number font-display text-4xl text-champagne-gold md:text-5xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-velvet-night md:text-3xl">{item.title}</h3>
                    {item.body ? (
                      <p className="home-body mt-3 max-w-md">{item.body}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </StaggerReveal>

            {image ? (
              <ClipReveal direction="right" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
                <MediaImage
                  image={image}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="absolute inset-0 h-full w-full"
                />
              </ClipReveal>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} eyebrow={section.eyebrow} heading={section.heading}>
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-border bg-surface-elevated p-5">
              <span className="font-display text-3xl text-champagne-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl text-velvet-night">{item.title}</h3>
                {item.body ? <p className="mt-2 text-sm text-muted-stone">{item.body}</p> : null}
              </div>
            </article>
          ))}
        </div>
        {image ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
            <MediaImage image={image} sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
