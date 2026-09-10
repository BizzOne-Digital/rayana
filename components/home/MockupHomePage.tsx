"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Heart, Sparkles, UserRound, Users, Waves } from "lucide-react";
import { HeroCinematic } from "@/components/home/HeroCinematic";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import { BOOK_CONSULTATION_LABEL, RAYANA_BRINGS_ITEMS, RAYANA_HOME_STORY_BODY, RAYANA_OPENING_BODY, RAYANA_STORY_BODY, RAYANA_TESTIMONIALS } from "@/lib/data/site-copy";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionContext } from "@/lib/sections/registry";
import type {
  IconListItem,
  NumberedStepItem,
  PublicService,
  PublicTestimonial,
  TypedPageSection,
} from "@/lib/sections/types";

type MockupHomePageProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

const SERVICE_META = [
  { icon: UserRound, cta: "Learn More" },
  { icon: BookOpen, cta: "Learn More" },
  { icon: Waves, cta: "Learn More" },
  { icon: Users, cta: "Learn More" },
  { icon: Heart, cta: "Learn More" },
];

const DEFAULT_TESTIMONIALS: PublicTestimonial[] = RAYANA_TESTIMONIALS;

function findSection(sections: TypedPageSection[], id: string) {
  return sections.find((s) => s.id === id);
}

function MockupOrnament() {
  return (
    <div className="mockup-ornament" aria-hidden>
      <span className="mockup-ornament-line" />
      <Sparkles className="mockup-ornament-icon h-4 w-4" />
      <span className="mockup-ornament-line" />
    </div>
  );
}

export function MockupHomePage({ sections, context }: MockupHomePageProps) {
  const hero = findSection(sections, "home-hero");
  const welcome = findSection(sections, "home-welcome");
  const story = findSection(sections, "home-story");
  const brings = findSection(sections, "home-brings");
  const philosophy = findSection(sections, "home-philosophy");
  const heart = findSection(sections, "home-heart");
  const method = findSection(sections, "home-method");
  const offerings = findSection(sections, "home-offerings");
  const testimonialsSection = findSection(sections, "home-testimonials");
  const media = findSection(sections, "home-media");
  const cta = findSection(sections, "home-cta");

  const services = useMemo(() => {
    const list = [...(context?.services ?? [])].sort(
      (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
    );
    const limit = Number(offerings?.settings?.limit ?? 5);
    return list.slice(0, limit);
  }, [context?.services, offerings?.settings?.limit]);

  const testimonials = useMemo(() => {
    const list = (context?.testimonials ?? []).filter((t) => t.featured);
    return list.length ? list : DEFAULT_TESTIMONIALS;
  }, [context?.testimonials]);

  const bringsItems =
    (brings?.items as IconListItem[] | undefined)?.length
      ? (brings!.items as IconListItem[])
      : RAYANA_BRINGS_ITEMS.map((title) => ({ title, body: "", icon: "heart" }));

  const methodItems =
    (method?.items as NumberedStepItem[] | undefined)?.length
      ? (method!.items as NumberedStepItem[])
      : [
          { title: "See", body: "What is actually happening." },
          { title: "Understand", body: "What dynamic is shaping your experience." },
          {
            title: "Integrate",
            body: "How to move forward with greater truth, consciousness, and from a deeper presence.",
          },
        ];

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(testimonialIndex, testimonialIndex + 3);
  const paddedTestimonials =
    visibleTestimonials.length === 3
      ? visibleTestimonials
      : [...visibleTestimonials, ...DEFAULT_TESTIMONIALS].slice(0, 3);

  useEffect(() => {
    refreshScrollTriggers();
  }, []);

  if (!hero) return null;

  return (
    <div className="mockup-home">
      <HeroCinematic section={{ ...hero, layoutVariant: "mockup" }} />

      {/* Welcome — white */}
      <section id={welcome?.id ?? "home-welcome"} className="mockup-section mockup-section--light">
        <div className="site-container mockup-welcome-grid">
          <div className="mockup-welcome-image">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.25)]">
              <MediaImage
                image={welcome?.images?.[0] ?? SEED_IMAGES.portrait2}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
          <div className="mockup-welcome-copy">
            <p className="mockup-eyebrow mockup-eyebrow--dark">{welcome?.eyebrow ?? "Welcome"}</p>
            <h2 className="mockup-heading mockup-heading--dark">
              {welcome?.heading ?? "Rayana De Silva, Master of Heart Matters"}
            </h2>
            <RichText
              html={
                welcome?.body?.trim()
                  ? welcome.body
                  : RAYANA_OPENING_BODY
              }
              className="mockup-body mockup-body--dark mt-6 max-w-xl"
            />
            <SiteButtons
              buttons={
                welcome?.buttons?.length
                  ? welcome.buttons
                  : [{ label: "Learn More About Rayana", href: "/about", variant: "secondary" as const, openInNewTab: false }]
              }
              className="mt-8"
            />
          </div>
        </div>
        <div className="mockup-section-curve mockup-section-curve--down" aria-hidden />
      </section>

      {/* My Story — white */}
      <section id={story?.id ?? "home-story"} className="mockup-section mockup-section--light">
        <div className="site-container mockup-heart-grid">
          <div>
            <p className="mockup-eyebrow mockup-eyebrow--dark">{story?.eyebrow ?? "About"}</p>
            <h2 className="mockup-heading mockup-heading--dark">{story?.heading ?? "My Story"}</h2>
            <RichText
              html={story?.body?.trim() ? story.body : RAYANA_HOME_STORY_BODY}
              className="mockup-body mockup-body--dark mt-6 space-y-4"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.2)]">
            <MediaImage
              image={story?.images?.[0] ?? SEED_IMAGES.portrait1}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* What Brings You Here — dark */}
      <section id={brings?.id ?? "home-brings"} className="mockup-section mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow">{brings?.eyebrow ?? "Is This You?"}</p>
          <h2 className="mockup-heading mt-3">{brings?.heading ?? "What Brings You Here?"}</h2>
          <MockupOrnament />
          <ul className="mt-10 space-y-3 text-left">
            {bringsItems.map((item) => (
              <li key={item.title} className="mockup-check-item justify-start">
                <Heart className="mockup-check-icon h-4 w-4 shrink-0" />
                <span className="text-rose-mist/92">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophy — white */}
      <section id={philosophy?.id ?? "home-philosophy"} className="mockup-section mockup-section--light text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow mockup-eyebrow--dark">{philosophy?.eyebrow ?? "My Philosophy"}</p>
          <h2 className="mockup-heading mockup-heading--dark mt-3">
            {philosophy?.heading ?? "The Wisdom Heart"}
          </h2>
            <RichText
              html={
                philosophy?.body?.trim()
                  ? philosophy.body
                  : "<p>Understanding yourself deeply through the lens of the wisdom heart changes how you understand and move through the world.</p>"
              }
            className="mockup-body mockup-body--dark mx-auto mt-6 max-w-2xl"
          />
        </div>
      </section>

      {/* The Heart Remembers — dark */}
      <section id={heart?.id ?? "home-heart"} className="mockup-section mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <h2 className="mockup-heading mt-3">{heart?.heading ?? "The Heart Remembers"}</h2>
          <MockupOrnament />
          <RichText
            html={
              heart?.body ??
              "<p>The heart holds the map.<br/>The spirit knows the way.</p>"
            }
            className="mockup-body mx-auto mt-6 max-w-xl text-lg opacity-92"
          />
        </div>
      </section>

      {/* How I Work — dark */}
      <section id={method?.id ?? "home-method"} className="mockup-section mockup-section--dark text-center">
        <div className="site-container">
          <p className="mockup-eyebrow">{method?.eyebrow ?? "How I Work"}</p>
          <h2 className="mockup-heading mt-3">{method?.heading ?? "See · Understand · Integrate"}</h2>
          <MockupOrnament />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {methodItems.map((item, index) => (
              <article key={item.title} className="mockup-timeline-step">
                <div className="mockup-timeline-marker">
                  <span>{index + 1}</span>
                </div>
                <h3 className="mockup-card-title mt-5 text-base uppercase tracking-[0.14em]">
                  {item.title}
                </h3>
                <p className="mockup-body mt-3 text-sm leading-relaxed opacity-90">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work With Me — dark */}
      <section id={offerings?.id ?? "home-offerings"} className="mockup-section mockup-section--dark">
        <div className="site-container text-center">
          <p className="mockup-eyebrow">{offerings?.eyebrow ?? "Work With Me"}</p>
          <h2 className="mockup-heading mt-3">{offerings?.heading ?? "Ways to Work Together"}</h2>
          <MockupOrnament />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service: PublicService, index: number) => {
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
        </div>
      </section>

      {/* Testimonials — dark */}
      <section id={testimonialsSection?.id ?? "home-testimonials"} className="mockup-section mockup-section--dark">
        <div className="site-container text-center">
          <p className="mockup-eyebrow">{testimonialsSection?.eyebrow ?? "Testimonials"}</p>
          <h2 className="mockup-heading mt-3">
            {testimonialsSection?.heading ?? "From the Heart"}
          </h2>
          <MockupOrnament />
          {testimonialsSection?.body ? (
            <RichText html={testimonialsSection.body} className="mockup-body mx-auto mt-4 max-w-xl opacity-90" />
          ) : null}
          {testimonialsSection?.buttons?.length ? (
            <SiteButtons buttons={testimonialsSection.buttons} className="mt-6 justify-center" />
          ) : null}

          <div className="relative mt-12 md:px-12">
            <button
              type="button"
              aria-label="Previous testimonials"
              className="mockup-carousel-btn absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 md:left-0 md:inline-flex"
              onClick={() =>
                setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="grid gap-5 md:grid-cols-3">
              {paddedTestimonials.map((item, index) => (
                <figure key={`${item.slug}-${index}`} className="mockup-testimonial-card">
                  <blockquote className="mockup-testimonial-quote mockup-testimonial-quote--preview">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-champagne-gold/30">
                      <Image
                        src={SEED_IMAGES.portrait1.url}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-warm-ivory">{item.name}</p>
                      {item.role ? (
                        <p className="text-xs text-rose-mist/75">{item.role}</p>
                      ) : null}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next testimonials"
              className="mockup-carousel-btn absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 md:right-0 md:inline-flex"
              onClick={() => setTestimonialIndex((i) => (i + 1) % testimonials.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Media — white */}
      <section id={media?.id ?? "home-media"} className="mockup-section mockup-section--light text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow mockup-eyebrow--dark">{media?.eyebrow ?? "Media"}</p>
          <h2 className="mockup-heading mockup-heading--dark mt-3">
            {media?.heading ?? "Latest Video, Podcast & Teaching"}
          </h2>
          <MockupOrnament />
          <RichText
            html={
              media?.body ??
              "<p>New teachings and media will appear here — most likely via YouTube. Nothing to share just yet; please check back soon.</p>"
            }
            className="mockup-body mockup-body--dark mx-auto mt-6 max-w-2xl"
          />
        </div>
      </section>

      {/* Final CTA — dark */}
      <section id={cta?.id ?? "home-cta"} className="mockup-section mockup-section--dark mockup-section--cta">
        <div className="site-container mockup-cta-grid">
          <div className="mockup-cta-portal relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full">
            <MediaImage
              image={cta?.images?.[0] ?? SEED_IMAGES.sacred}
              sizes="(max-width: 768px) 80vw, 420px"
              className="absolute inset-0 h-full w-full"
            />
            <div className="mockup-cta-portal-glow absolute inset-0 rounded-full" />
          </div>
          <div>
            <h2 className="mockup-heading">{cta?.heading ?? "Begin Where You Are"}</h2>
            <RichText
              html={
                cta?.body ??
                "<p>The next step is already within you. I'm here to walk beside you as you return to what matters most.</p>"
              }
              className="mockup-body mt-5 max-w-lg opacity-90"
            />
            <SiteButtons
              buttons={
                cta?.buttons?.length
                  ? cta.buttons
                  : [{ label: BOOK_CONSULTATION_LABEL, href: "/booking", variant: "primary" as const, openInNewTab: false }]
              }
              className="mt-8"
              variant="hero"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
