import Link from "next/link";
import { BookOpen, Heart, UserRound, Users, Waves } from "lucide-react";
import { MediaImage } from "@/components/site/MediaImage";
import type { PublicService } from "@/lib/sections/types";

const SERVICE_META = [
  { icon: UserRound, cta: "Learn More" },
  { icon: BookOpen, cta: "Learn More" },
  { icon: Waves, cta: "Learn More" },
  { icon: Users, cta: "Learn More" },
  { icon: Heart, cta: "Learn More" },
];

type WorkWithMeHubProps = {
  services: PublicService[];
  limit?: number;
};

export function WorkWithMeHub({ services, limit = 5 }: WorkWithMeHubProps) {
  const items = [...services]
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .slice(0, limit);

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((service, index) => {
        const meta = SERVICE_META[index] ?? SERVICE_META[0];
        const Icon = meta.icon;
        return (
          <article key={service.slug} className="mockup-offering-card">
            <div className="relative aspect-[4/3] overflow-hidden">
              <MediaImage
                image={service.mainImage}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-6 text-left md:p-7">
              <span className="mockup-offering-icon">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mockup-card-title mt-4">{service.title}</h3>
              <p className="mockup-body mt-3 text-sm leading-relaxed opacity-90">
                {service.shortDescription}
              </p>
              <Link
                href={service.cardCta.href || `/services/${service.slug}`}
                className="mockup-card-link mt-6 inline-flex"
              >
                {meta.cta} →
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
