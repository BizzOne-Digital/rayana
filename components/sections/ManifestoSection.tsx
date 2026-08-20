import { ClipReveal } from "@/components/animations/ClipReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/utils";
import type { SectionProps } from "@/lib/sections/registry";

export function ManifestoSection({ section }: SectionProps) {
  const image = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (isEditorial) {
    return (
      <section
        id={section.id}
        className="home-manifesto relative overflow-hidden py-20 md:py-28 lg:py-32"
      >
        <div className="home-manifesto-bg texture-grain absolute inset-0" />
        <div className="site-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="home-eyebrow mb-6">Manifesto</p>
              <h2 className="home-manifesto-heading">{section.heading}</h2>
              <RichText html={section.body} className="home-manifesto-body mt-8" />
            </div>
            {image ? (
              <ClipReveal direction="right" className="mx-auto w-full max-w-sm">
                <div className="home-manifesto-orbit relative aspect-square overflow-hidden rounded-full">
                  <MediaImage
                    image={image}
                    sizes="400px"
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="home-manifesto-orbit-ring absolute inset-0 rounded-full" />
                </div>
              </ClipReveal>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className="section-padding bg-deep-burgundy text-warm-ivory texture-grain">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow mb-4 text-soft-rose">Manifesto</p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
            {section.heading}
          </h2>
          <RichText html={section.body} className="mt-6 text-rose-mist/90 max-w-2xl" />
        </div>
        {image ? (
          <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border border-champagne-gold/30 md:h-56 md:w-56">
            <MediaImage image={image} sizes="240px" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
