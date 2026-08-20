import { HeroCinematic } from "@/components/home/HeroCinematic";
import { SiteButtons } from "@/components/ui/SiteButton";
import { cn } from "@/lib/utils";
import type { SectionProps } from "@/lib/sections/registry";

export function HeroSection({ section }: SectionProps) {
  const isCinematic =
    section.layoutVariant === "cinematic" ||
    section.layoutVariant === "editorial" ||
    section.id === "home-hero";
  const isBurgundy = section.themeVariant === "burgundy" || isCinematic;

  if (isCinematic) {
    return <HeroCinematic section={section} />;
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden section-padding text-center",
        isBurgundy
          ? "theme-burgundy texture-velvet texture-grain flex min-h-[50vh] items-center"
          : "texture-parchment",
      )}
    >
      <div className="site-container mx-auto max-w-3xl">
        {section.eyebrow ? (
          <p className={cn("eyebrow mb-4", isBurgundy && "text-soft-rose")}>
            {section.eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "display-heading text-4xl md:text-5xl lg:text-6xl text-balance",
            isBurgundy ? "text-warm-ivory" : "text-velvet-night",
          )}
        >
          {section.heading}
        </h1>
        {section.body ? (
          <p
            className={cn(
              "mx-auto mt-5 max-w-2xl text-pretty leading-relaxed",
              isBurgundy ? "text-soft-rose/90" : "text-muted-stone",
            )}
          >
            {section.body}
          </p>
        ) : null}
        <SiteButtons buttons={section.buttons} className="mt-8 justify-center" />
      </div>
    </section>
  );
}
