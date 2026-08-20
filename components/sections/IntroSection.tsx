import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import type { SectionProps } from "@/lib/sections/registry";

export function IntroSection({ section }: SectionProps) {
  return (
    <SectionShell
      id={section.id}
      eyebrow={section.eyebrow}
      heading={section.heading}
      themeVariant={section.themeVariant}
      className="texture-parchment"
    >
      <ScrollReveal className="max-w-3xl">
        <RichText html={section.body} />
        <SiteButtons buttons={section.buttons} className="mt-8" />
      </ScrollReveal>
    </SectionShell>
  );
}
