import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import type { SectionProps } from "@/lib/sections/registry";

export function ImagePairSection({ section }: SectionProps) {
  const [left, right] = section.images ?? [];

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {left ? (
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-soft">
              <MediaImage image={left} sizes="(max-width: 768px) 100vw, 45vw" />
            </div>
          </ScrollReveal>
        ) : null}
        {right ? (
          <ScrollReveal delay={0.12}>
            <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-soft md:mt-16">
              <MediaImage image={right} sizes="(max-width: 768px) 100vw, 45vw" />
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </SectionShell>
  );
}
