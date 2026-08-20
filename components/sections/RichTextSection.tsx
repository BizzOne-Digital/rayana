import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import { RichText } from "@/components/ui/RichText";
import type { SectionProps } from "@/lib/sections/registry";

export function RichTextSection({ section }: SectionProps) {
  const image = section.images?.[0];

  return (
    <SectionShell
      id={section.id}
      eyebrow={section.eyebrow}
      heading={section.heading}
      themeVariant={section.themeVariant}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
        <ScrollReveal>
          <RichText html={section.body} />
        </ScrollReveal>
        {image ? (
          <ScrollReveal delay={0.1}>
            <div className="relative aspect-[5/6] overflow-hidden rounded-2xl shadow-soft">
              <MediaImage image={image} sizes="(max-width: 1024px) 100vw, 35vw" />
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </SectionShell>
  );
}
