import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import { defaultImage } from "@/lib/data/seed-images";
import type { SectionProps } from "@/lib/sections/registry";

export function ImageMarqueeSection({ section }: SectionProps) {
  const images =
    section.images?.length ? section.images : [defaultImage(0), defaultImage(1), defaultImage(2), defaultImage(3)];
  const track = [...images, ...images];

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow} className="overflow-hidden">
      <div className="relative -mx-[var(--section-px)]">
        <div className="flex w-max animate-marquee gap-4 px-4">
          {track.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative h-56 w-44 shrink-0 overflow-hidden rounded-2xl md:h-72 md:w-56"
            >
              <MediaImage image={image} sizes="240px" />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
