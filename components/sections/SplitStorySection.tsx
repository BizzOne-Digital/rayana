import { ClipReveal } from "@/components/animations/ClipReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import { SectionShell } from "@/components/ui/SectionShell";
import type { SectionProps } from "@/lib/sections/registry";

export function SplitStorySection({ section }: SectionProps) {
  const [left, right] = section.images ?? [];
  const reverse = section.layoutVariant === "reverse";
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (isEditorial) {
    return (
      <section id={section.id} className="home-story section-padding texture-parchment texture-grain">
        <div className="site-container">
          <div className={`asymmetric-grid ${reverse ? "reverse" : ""}`}>
            <div className="order-2 md:order-none">
              {section.eyebrow ? <p className="home-eyebrow-dark mb-5">{section.eyebrow}</p> : null}
              <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading" />
              <RichText html={section.body} className="home-body mt-7 max-w-xl" />
              <SiteButtons buttons={section.buttons} className="mt-9" />
            </div>

            <div className="relative order-1 md:order-none">
              <div className="home-story-images grid gap-5">
                {left ? (
                  <ClipReveal direction="left" className="home-story-main relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                    <MediaImage
                      image={left}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="absolute inset-0 h-full w-full"
                    />
                  </ClipReveal>
                ) : null}
                {right ? (
                  <ClipReveal
                    direction="right"
                    className="home-story-accent relative ml-auto aspect-[3/4] w-[78%] overflow-hidden rounded-[1.5rem]"
                  >
                    <MediaImage
                      image={right}
                      sizes="(max-width: 768px) 80vw, 28vw"
                      className="absolute inset-0 h-full w-full"
                    />
                  </ClipReveal>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionShell
      id={section.id}
      eyebrow={section.eyebrow}
      themeVariant={section.themeVariant}
      containerClassName="max-w-none"
    >
      <div className={`asymmetric-grid ${reverse ? "reverse" : ""}`}>
        <div className="order-2 md:order-none">
          <h2 className="display-heading text-3xl md:text-4xl lg:text-5xl text-balance mb-6">
            {section.heading}
          </h2>
          <RichText html={section.body} />
          <SiteButtons buttons={section.buttons} className="mt-8" />
        </div>
        <div className="relative order-1 md:order-none">
          <div className="grid gap-4">
            {left ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-soft">
                <MediaImage image={left} sizes="(max-width: 768px) 100vw, 40vw" />
              </div>
            ) : null}
            {right ? (
              <div className="relative ml-auto w-[78%] aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-border shadow-soft">
                <MediaImage image={right} sizes="(max-width: 768px) 80vw, 28vw" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
