import {
  Compass,
  Feather,
  Heart,
  Map,
  RefreshCw,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import type { IconListItem } from "@/lib/sections/types";
import type { SectionProps } from "@/lib/sections/registry";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  refresh: RefreshCw,
  heart: Heart,
  map: Map,
  sparkles: Sparkles,
  sun: Sun,
  feather: Feather,
};

export function IconListSection({ section }: SectionProps) {
  const items = (section.items ?? []) as IconListItem[];
  const image = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (isEditorial) {
    return (
      <section id={section.id} className="home-brings relative overflow-hidden py-20 md:py-28">
        <div className="home-brings-bg texture-grain absolute inset-0" />
        <div className="site-container relative z-10">
          <div className="grid gap-12 xl:grid-cols-[1fr_0.85fr]">
            <div>
              {section.eyebrow ? <p className="home-eyebrow mb-5">{section.eyebrow}</p> : null}
              <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading-light" />
              <StaggerReveal className="mt-10 space-y-0" stagger={0.06}>
                {items.map((item, index) => {
                  const Icon = ICONS[item.icon ?? ""] ?? Sparkles;
                  return (
                    <div
                      key={`${item.title}-${index}`}
                      className="home-brings-item group flex gap-5 border-t border-champagne-gold/15 py-5 first:border-t-0"
                    >
                      <span className="home-brings-index font-display text-champagne-gold/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-1 gap-4">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne-gold/25 bg-champagne-gold/5 text-champagne-gold transition-colors group-hover:border-champagne-gold/50 group-hover:bg-champagne-gold/10">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="home-brings-text pt-2 font-display text-lg text-warm-ivory/92 md:text-xl">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </StaggerReveal>
            </div>
            {image ? (
              <ClipReveal direction="up" className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <MediaImage
                  image={image}
                  sizes="(max-width: 1280px) 100vw, 40vw"
                  className="absolute inset-0 h-full w-full"
                />
                <div className="home-image-vignette absolute inset-0" />
              </ClipReveal>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = ICONS[item.icon ?? ""] ?? Sparkles;
            return (
              <li key={`${item.title}-${index}`} className="flex gap-3 rounded-2xl border border-border bg-warm-ivory p-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-mist/50 text-heart-wine">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="font-medium text-ink-plum">{item.title}</p>
              </li>
            );
          })}
        </ul>
        {image ? (
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] shadow-soft">
            <MediaImage image={image} sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
