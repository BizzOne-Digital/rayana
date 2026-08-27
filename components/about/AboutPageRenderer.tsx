"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, Orbit, Sparkles } from "lucide-react";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import { BOOK_CONSULTATION_LABEL, RAYANA_STORY_BODY, RAYANA_VALUES_ITEMS } from "@/lib/data/site-copy";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionContext } from "@/lib/sections/registry";
import type { IconListItem, NumberedStepItem, TypedPageSection } from "@/lib/sections/types";

type AboutPageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

function findSection(sections: TypedPageSection[], id: string) {
  return sections.find((s) => s.id === id);
}

function MockupOrnament({ dark = false }: { dark?: boolean }) {
  return (
    <div className="mockup-ornament" aria-hidden>
      <span className="mockup-ornament-line" />
      <Sparkles className={`mockup-ornament-icon h-4 w-4 ${dark ? "text-[#7e1638]" : ""}`} />
      <span className="mockup-ornament-line" />
    </div>
  );
}

const DEFAULT_JOURNEY: NumberedStepItem[] = [
  { title: "See", body: "What is actually happening." },
          { title: "Understand", body: "What dynamic is shaping your experience." },
  {
    title: "Integrate",
    body: "How to move forward with greater truth, consciousness, and from a deeper presence.",
  },
];

const DEFAULT_PRINCIPLES: IconListItem[] = [
  {
    title: "Clarity",
    body: "Meeting life with greater clarity and seeing what we could not previously see about ourselves and our lives.",
    icon: "heart",
  },
  {
    title: "Consciousness",
    body: "Making choices from a place of greater consciousness, truth, and sovereignty.",
    icon: "orbit",
  },
  {
    title: "Presence",
    body: "Transforming uncertainty into understanding and wisdom, to be used daily.",
    icon: "flame",
  },
];

const DEFAULT_VALUES: IconListItem[] = RAYANA_VALUES_ITEMS;

const BEHIND_LABELS = [
  "Journaling & Reflection",
  "Quiet Preparation",
  "Curating Sacred Space",
  "Nature & Renewal",
  "Reverence and Grace",
];

const BEHIND_IMAGES = [
  SEED_IMAGES.teaching,
  SEED_IMAGES.session,
  SEED_IMAGES.sacred,
  SEED_IMAGES.nature,
  SEED_IMAGES.landscape,
];

const PRINCIPLE_ICONS = {
  heart: Heart,
  orbit: Orbit,
  flame: Flame,
};

const VALUE_IMAGES = [
  SEED_IMAGES.sacred,
  SEED_IMAGES.texture,
  SEED_IMAGES.hands,
  SEED_IMAGES.nature,
];

export function AboutPageRenderer({ sections }: AboutPageRendererProps) {
  const hero = findSection(sections, "about-hero");
  const intro = findSection(sections, "about-intro");
  const journey = findSection(sections, "about-journey");
  const principles = findSection(sections, "about-principles");
  const teaching = findSection(sections, "about-teaching");
  const values = findSection(sections, "about-values");
  const behind = findSection(sections, "about-behind");
  const quote = findSection(sections, "about-quote");
  const cta = findSection(sections, "about-cta");

  const journeyItems = (journey?.items as NumberedStepItem[] | undefined)?.length
    ? (journey!.items as NumberedStepItem[])
    : DEFAULT_JOURNEY;

  const principleItems = (principles?.items as IconListItem[] | undefined)?.length
    ? (principles!.items as IconListItem[])
    : DEFAULT_PRINCIPLES;

  const valueItems = (values?.items as IconListItem[] | undefined)?.length
    ? (values!.items as IconListItem[])
    : DEFAULT_VALUES;

  useEffect(() => {
    refreshScrollTriggers();
  }, []);

  return (
    <div className="mockup-about">
      {/* Hero — dark */}
      <section id={hero?.id ?? "about-hero"} className="mockup-about-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow">{hero?.eyebrow ?? "About Rayana"}</p>
          <h1 className="mockup-about-hero-heading mt-4">
            {hero?.heading ?? "My Story"}
          </h1>
          <RichText
            html={
              hero?.body ??
              "<p>Clarity · Consciousness · Truth · Presence</p>"
            }
            className="mockup-body mx-auto mt-5 max-w-xl opacity-90"
          />
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      {/* Intro — white */}
      <section id={intro?.id ?? "about-intro"} className="mockup-section mockup-section--light">
        <div className="site-container mockup-about-intro-grid">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.18)]">
            <MediaImage
              image={intro?.images?.[0] ?? SEED_IMAGES.portrait1}
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div>
            <h2 className="mockup-heading mockup-heading--dark">
              {intro?.heading ?? "A Deeper Way of Seeing What Matters"}
            </h2>
            <RichText
              html={intro?.body ?? RAYANA_STORY_BODY}
              className="mockup-body mockup-body--dark mt-6 space-y-4"
            />
          </div>
        </div>
      </section>

      {/* Journey — dark */}
      <section id={journey?.id ?? "about-journey"} className="mockup-section mockup-section--dark text-center">
        <div className="site-container">
          <h2 className="mockup-heading">{journey?.heading ?? "See · Understand · Integrate"}</h2>
          <MockupOrnament />
          <div className="mockup-timeline mt-14">
            {journeyItems.map((item, index) => (
              <article key={item.title} className="mockup-timeline-step">
                <div className="mockup-timeline-marker">
                  <span>{index + 1}</span>
                </div>
                <h3 className="mockup-card-title mt-5 text-lg uppercase tracking-[0.14em]">
                  {item.title}
                </h3>
                <p className="mockup-body mt-3 text-sm leading-relaxed opacity-90">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Principles — dark */}
      <section
        id={principles?.id ?? "about-principles"}
        className="mockup-section mockup-section--dark text-center"
      >
        <div className="site-container">
          <p className="mockup-eyebrow">{principles?.eyebrow ?? "My Philosophy"}</p>
          <h2 className="mockup-heading mt-3">
            {principles?.heading ?? "The Wisdom Heart"}
          </h2>
          <MockupOrnament />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {principleItems.map((item) => {
              const Icon =
                PRINCIPLE_ICONS[item.icon as keyof typeof PRINCIPLE_ICONS] ?? Heart;
              return (
                <article key={item.title} className="mockup-principle-card">
                  <div className="mockup-principle-icon-wrap">
                    <Icon className="h-7 w-7 text-[#e8c97a]" />
                  </div>
                  <h3 className="mockup-card-title mt-6 text-base uppercase tracking-[0.16em]">
                    {item.title}
                  </h3>
                  <p className="mockup-body mt-3 text-sm leading-relaxed opacity-90">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching — white */}
      <section id={teaching?.id ?? "about-teaching"} className="mockup-section mockup-section--light">
        <div className="site-container mockup-about-teaching-grid">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.18)]">
            <MediaImage
              image={teaching?.images?.[0] ?? SEED_IMAGES.workshop}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div>
            <h2 className="mockup-heading mockup-heading--dark">
              {teaching?.heading ?? "Over 30 Years of Experience"}
            </h2>
            <RichText
              html={
                teaching?.body ??
                "<p>Rayana offers her expertise with over 30 years of professional and international experience in private practice, and as an educator.</p>"
              }
              className="mockup-body mockup-body--dark mt-6 max-w-lg"
            />
            <SiteButtons
              buttons={
                teaching?.buttons?.length
                  ? teaching.buttons
                  : [
                      {
                        label: "Work With Me",
                        href: "/services/private-consultations",
                        variant: "secondary" as const,
                        openInNewTab: false,
                      },
                    ]
              }
              className="mt-8"
            />
          </div>
        </div>
      </section>

      {/* Values — dark */}
      <section id={values?.id ?? "about-values"} className="mockup-section mockup-section--dark text-center">
        <div className="site-container">
          <h2 className="mockup-heading">{values?.heading ?? "What I Value Most"}</h2>
          <MockupOrnament />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {valueItems.map((item, index) => (
              <article key={item.title} className="mockup-value-card">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <MediaImage
                    image={VALUE_IMAGES[index] ?? SEED_IMAGES.sacred}
                    sizes="(max-width: 1280px) 50vw, 25vw"
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="mockup-value-overlay absolute inset-0" />
                </div>
                <div className="p-5 text-left">
                  <h3 className="mockup-card-title text-sm uppercase tracking-[0.16em]">
                    {item.title}
                  </h3>
                  <p className="mockup-body mt-2 text-xs leading-relaxed opacity-85">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Behind the Work — white */}
      <section id={behind?.id ?? "about-behind"} className="mockup-section mockup-section--light text-center">
        <div className="site-container">
          <h2 className="mockup-heading mockup-heading--dark">
            {behind?.heading ?? "Behind the Work"}
          </h2>
          <MockupOrnament dark />
          <div className="mt-10 grid min-w-0 grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            {BEHIND_LABELS.map((label, index) => (
              <figure key={label} className="mockup-behind-strip group min-w-0">
                <div className="relative aspect-[3/5] overflow-hidden rounded-xl">
                  <MediaImage
                    image={BEHIND_IMAGES[index] ?? SEED_IMAGES.nature}
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="absolute inset-0 h-full w-full"
                    imageClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="mockup-behind-overlay absolute inset-0" />
                  <figcaption className="mockup-behind-caption">{label}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Quote — dark */}
      <section id={quote?.id ?? "about-quote"} className="mockup-section mockup-section--dark">
        <div className="site-container mockup-about-quote">
          <div className="mockup-about-quote-heart" aria-hidden>
            <Heart className="h-8 w-8 text-[#e8c97a]" />
          </div>
          <blockquote className="mockup-about-quote-text">
            {stripQuote(quote?.body) ??
              "When we learn to see more deeply, we understand ourselves more honestly. When we understand ourselves more honestly, we become free to live more consciously, and create the life we want."}
          </blockquote>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="relative h-12 w-36">
              <Image
                src="/brand/rayana-logo.png"
                alt=""
                fill
                sizes="144px"
                className="object-contain object-center opacity-90"
              />
            </div>
            <p className="text-sm text-rose-mist/80">
              {quote?.heading ?? "When We Learn to See More Deeply"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA — white */}
      <section id={cta?.id ?? "about-cta"} className="mockup-section mockup-section--light text-center">
        <div className="site-container max-w-3xl">
          <h2 className="mockup-heading mockup-heading--dark">
            {cta?.heading ?? "Begin Where You Are"}
          </h2>
          <RichText
            html={
              cta?.body ??
              "<p>Centre yourself. Bring your questions. Allow space for what wants to be seen.</p>"
            }
            className="mockup-body mockup-body--dark mt-4"
          />
          <SiteButtons
            buttons={
              cta?.buttons?.length
                ? cta.buttons
                : [{ label: BOOK_CONSULTATION_LABEL, href: "/booking", variant: "primary" as const, openInNewTab: false }]
            }
            className="mt-8 justify-center"
            variant="hero"
          />
          <div className="mockup-about-cta-links mt-8 flex flex-wrap items-center justify-center gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#7e1638]/75">
            <Link href="/services/private-consultations" className="hover:text-[#4e0505]">
              Private Sessions
            </Link>
            <span aria-hidden>•</span>
            <Link href="/services/teachings-courses" className="hover:text-[#4e0505]">
              Teachings & Courses
            </Link>
            <span aria-hidden>•</span>
            <Link href="/services/workshops-retreats" className="hover:text-[#4e0505]">
              Workshops & Retreats
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function stripQuote(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/^[“"']|[”"']$/g, "").trim();
}
