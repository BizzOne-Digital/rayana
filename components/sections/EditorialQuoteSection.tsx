import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import type { SectionProps } from "@/lib/sections/registry";

export function EditorialQuoteSection({ section }: SectionProps) {
  const image = section.images?.[0];

  return (
    <section id={section.id} className="section-padding">
      <div className="site-container">
        <ScrollReveal>
          <figure className="relative overflow-hidden rounded-[2rem] bg-parchment px-8 py-12 md:px-14 md:py-16 texture-grain">
            <div className="golden-thread-line absolute inset-x-10 top-10" />
            {section.heading ? (
              <p className="eyebrow mb-6">{section.heading}</p>
            ) : null}
            <blockquote className="font-display text-2xl md:text-4xl leading-snug text-velvet-night text-balance">
              <RichText html={section.body} className="!max-w-none !text-2xl md:!text-4xl !leading-snug" />
            </blockquote>
            {image ? (
              <div className="mt-10 relative aspect-[21/9] overflow-hidden rounded-xl">
                <MediaImage image={image} sizes="(max-width: 768px) 100vw, 70vw" />
              </div>
            ) : null}
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
