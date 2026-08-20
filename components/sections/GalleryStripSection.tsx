import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import type { SectionProps } from "@/lib/sections/registry";

export function GalleryStripSection({ section, context }: SectionProps) {
  const images = context?.galleryImages ?? [];

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {images.slice(0, 8).map((item, index) => (
          <ScrollReveal key={item.slug} delay={index * 0.04}>
            <div className="group relative block aspect-square overflow-hidden rounded-2xl shadow-soft">
              <MediaImage image={item.image} sizes="(max-width: 768px) 50vw, 25vw" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-velvet-night/70 to-transparent p-3 text-xs text-warm-ivory opacity-0 transition-opacity group-hover:opacity-100">
                {item.title}
              </span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}
