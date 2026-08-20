"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  Heart,
  Sparkles,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionContext } from "@/lib/sections/registry";
import type { PublicFAQ, PublicService, TypedPageSection } from "@/lib/sections/types";

type ServicesPageRendererProps = {
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

const DEFAULT_PROCESS = [
  {
    title: "Arrive",
    body: "Come as you are—with your questions, your uncertainty, and your willingness to look more deeply.",
    icon: Sparkles,
  },
  {
    title: "Listen",
    body: "Together we create space to hear what your heart already knows beneath the noise of daily life.",
    icon: Heart,
  },
  {
    title: "Integrate",
    body: "Leave with clarity you can live—not just understand, but embody in your choices and relationships.",
    icon: Star,
  },
];

const DEFAULT_OUTCOMES = [
  {
    title: "Clarity",
    body: "See what is true beneath confusion, fear, or old patterns.",
    image: SEED_IMAGES.sacred,
  },
  {
    title: "Self-Trust",
    body: "Return to your inner knowing as a reliable guide.",
    image: SEED_IMAGES.portrait1,
  },
  {
    title: "Connection",
    body: "Deepen intimacy—with yourself, others, and what matters most.",
    image: SEED_IMAGES.hands,
  },
  {
    title: "Direction",
    body: "Move forward with integrity, presence, and purpose.",
    image: SEED_IMAGES.landscape,
  },
];

const DEFAULT_PATHS = [
  {
    title: "Private Sessions",
    bestIf: "Best if you need focused, one-to-one guidance right now.",
    benefits: ["Deep personal clarity", "Immediate insight on what matters", "Confidential, devoted attention"],
    href: "/services/private-consultation",
    cta: "Discover Sessions",
    icon: UserRound,
  },
  {
    title: "Heart Matters Teachings",
    bestIf: "Best if you want ongoing wisdom to integrate into daily life.",
    benefits: ["Structured teachings & practices", "Reflection between sessions", "Sustained transformation"],
    href: "/services/wisdom-mentoring",
    cta: "Explore Teachings",
    icon: BookOpen,
  },
  {
    title: "Group Experiences",
    bestIf: "Best if you are drawn to shared learning and collective presence.",
    benefits: ["Community & connection", "Guided group practices", "Affordable entry point"],
    href: "/services",
    cta: "View Experiences",
    icon: Users,
  },
];

const DEFAULT_FAQS: PublicFAQ[] = [
  {
    slug: "how-to-book",
    question: "How do I book a session?",
    answer:
      "Visit the booking page, choose your service and preferred time, and complete the confirmation steps. You'll receive a confirmation email with all the details you need.",
    category: "Booking",
  },
  {
    slug: "session-format",
    question: "Are sessions in person or online?",
    answer:
      "Both options are available depending on the service. Private sessions can be held in person in Vancouver or via secure video. Details are listed on each service page.",
    category: "General",
  },
  {
    slug: "which-service",
    question: "How do I know which offering is right for me?",
    answer:
      "If you're unsure, begin with a private session. Rayana will help you discern the path that meets you where you are—and what your heart is truly asking for.",
    category: "General",
  },
];

type ServiceBlock = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  bullets: string[];
  cta: string;
  href: string;
  image: typeof SEED_IMAGES.session;
  reverse?: boolean;
  light?: boolean;
};

function buildServiceBlocks(services: PublicService[]): ServiceBlock[] {
  const privateSvc = services.find((s) => s.slug === "private-consultation") ?? services[0];
  const teachings = services.find((s) => s.slug === "wisdom-mentoring") ?? services[1];
  const group = services.find((s) => s.slug === "group-experiences") ?? services[2];

  return [
    {
      id: "services-private",
      eyebrow: "One-to-One",
      heading: "Private Intuitive Sessions",
      body:
        "A sacred container for one-to-one guidance. In private sessions, Rayana helps you see beneath the surface of your life—relationships, crossroads, inner patterns—and return to what is true.",
      bullets: [
        "90-minute focused sessions",
        "In person (Vancouver) or video",
        "Clarity on relationships & life direction",
        "Integration practices between sessions",
      ],
      cta: "Discover Private Sessions",
      href: privateSvc?.cardCta.href ?? "/services/private-consultation",
      image: privateSvc?.mainImage ?? SEED_IMAGES.session,
      light: true,
    },
    {
      id: "services-teachings",
      eyebrow: "Learn & Expand",
      heading: "Heart Matters Teachings",
      body:
        "Structured teachings designed to deepen your understanding and support ongoing integration. Access wisdom teachings, written reflections, and guided practices at your own pace.",
      bullets: [
        "Video teachings & written reflections",
        "Practices for daily integration",
        "Ongoing mentoring options",
        "Access to a library of insights",
      ],
      cta: "Explore the Teachings",
      href: teachings?.cardCta.href ?? "/services/wisdom-mentoring",
      image: teachings?.mainImage ?? SEED_IMAGES.teaching,
      reverse: true,
    },
    {
      id: "services-group",
      eyebrow: "Together",
      heading: "Group Experiences",
      body:
        "Gather in circle for shared learning, collective healing, and heart-centred community. Group experiences offer a powerful container for those drawn to learning alongside others.",
      bullets: [
        "Workshops & group circles",
        "Candlelit, intimate settings",
        "Shared practices & reflection",
        "Community of like-hearted seekers",
      ],
      cta: "View Group Experiences",
      href: group?.cardCta.href ?? "/services",
      image: group?.mainImage ?? SEED_IMAGES.workshop,
      light: true,
    },
  ];
}

function ServiceDetailBlock({ block }: { block: ServiceBlock }) {
  const sectionClass = block.light ? "mockup-section--light" : "mockup-section--dark";

  return (
    <section id={block.id} className={`mockup-section ${sectionClass}`}>
      <div
        className={`site-container mockup-service-detail-grid ${block.reverse ? "mockup-service-detail-grid--reverse" : ""}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.22)]">
          <MediaImage
            image={block.image}
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div>
          <p className={block.light ? "mockup-eyebrow mockup-eyebrow--dark" : "mockup-eyebrow"}>
            {block.eyebrow}
          </p>
          <h2 className={`mockup-heading mt-3 ${block.light ? "mockup-heading--dark" : ""}`}>
            {block.heading}
          </h2>
          <p
            className={`mockup-body mt-5 max-w-lg text-base leading-relaxed ${block.light ? "mockup-body--dark" : "opacity-92"}`}
          >
            {block.body}
          </p>
          <ul className="mt-6 space-y-3">
            {block.bullets.map((item) => (
              <li key={item} className="mockup-check-item">
                <Check className="mockup-check-icon h-4 w-4 shrink-0" />
                <span className={block.light ? "text-[#25151b]" : "text-rose-mist/90"}>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href={block.href}
            className={`mockup-outline-btn mt-8 inline-flex ${block.light ? "mockup-outline-btn--dark" : ""}`}
          >
            {block.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ServicesPageRenderer({ sections, context }: ServicesPageRendererProps) {
  const hero = findSection(sections, "services-hero");
  const process = findSection(sections, "services-process");
  const faqSection = findSection(sections, "services-faq");
  const cta = findSection(sections, "services-cta");

  const services = useMemo(() => context?.services ?? [], [context?.services]);
  const serviceBlocks = useMemo(() => buildServiceBlocks(services), [services]);

  const faqs = useMemo(() => {
    const list = (context?.faqs ?? []).slice(0, 5);
    return list.length >= 3 ? list : DEFAULT_FAQS;
  }, [context?.faqs]);

  useEffect(() => {
    refreshScrollTriggers();
  }, []);

  return (
    <div className="mockup-services">
      {/* Hero — dark */}
      <section id={hero?.id ?? "services-hero"} className="mockup-services-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <h1 className="mockup-services-hero-heading">
            {hero?.heading ?? "Ways to Work with Rayana"}
          </h1>
          <RichText
            html={
              hero?.body ??
              "<p>Private sessions, wisdom teachings, and group experiences—each designed to help you see beneath the surface, understand what is true, and integrate that knowing into your life.</p>"
            }
            className="mockup-body mx-auto mt-5 max-w-xl opacity-90"
          />
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
        <div className="mockup-services-hero-curve" aria-hidden />
      </section>

      {serviceBlocks.map((block) => (
        <ServiceDetailBlock key={block.id} block={block} />
      ))}

      {/* Process — dark */}
      <section id={process?.id ?? "services-process"} className="mockup-section mockup-section--dark text-center">
        <div className="site-container">
          <p className="mockup-eyebrow">{process?.eyebrow ?? "A Journey of Integration"}</p>
          <h2 className="mockup-heading mt-3 uppercase tracking-[0.12em]">
            {process?.heading ?? "Arrive — Listen — Integrate"}
          </h2>
          <MockupOrnament />
          <div className="mockup-process-grid mt-12">
            {DEFAULT_PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="mockup-process-step">
                  <div className="mockup-process-icon">
                    <Icon className="h-6 w-6 text-[#e8c97a]" />
                  </div>
                  <h3 className="mockup-card-title mt-5 text-sm uppercase tracking-[0.16em]">
                    {step.title}
                  </h3>
                  <p className="mockup-body mt-3 text-sm leading-relaxed opacity-88">{step.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes — white */}
      <section id="services-outcomes" className="mockup-section mockup-section--light text-center">
        <div className="site-container">
          <p className="mockup-eyebrow mockup-eyebrow--dark">Possibilities Await</p>
          <h2 className="mockup-heading mockup-heading--dark mt-3">What May Open</h2>
          <MockupOrnament dark />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {DEFAULT_OUTCOMES.map((item) => (
              <article key={item.title} className="mockup-outcome-card">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1rem]">
                  <MediaImage
                    image={item.image}
                    sizes="(max-width: 1280px) 50vw, 25vw"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="p-5 text-left">
                  <h3 className="mockup-card-title mockup-card-title--dark text-sm uppercase tracking-[0.14em]">
                    {item.title}
                  </h3>
                  <p className="mockup-body mockup-body--dark mt-2 text-sm">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Path cards — dark */}
      <section id="services-paths" className="mockup-section mockup-section--dark text-center">
        <div className="site-container">
          <p className="mockup-eyebrow">Find the Path That Meets You</p>
          <h2 className="mockup-heading mt-3">Which Path Is Calling You?</h2>
          <MockupOrnament />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {DEFAULT_PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <article key={path.title} className="mockup-path-card">
                  <div className="mockup-path-icon">
                    <Icon className="h-5 w-5 text-[#e8c97a]" />
                  </div>
                  <h3 className="mockup-card-title mt-5 text-lg">{path.title}</h3>
                  <p className="mockup-body mt-3 text-sm italic opacity-85">{path.bestIf}</p>
                  <ul className="mt-5 space-y-2.5 text-left">
                    {path.benefits.map((benefit) => (
                      <li key={benefit} className="mockup-check-item justify-start text-sm">
                        <Check className="mockup-check-icon h-3.5 w-3.5 shrink-0" />
                        <span className="text-rose-mist/88">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={path.href} className="mockup-outline-btn mt-8 inline-flex w-full justify-center">
                    {path.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ — white */}
      <section id={faqSection?.id ?? "services-faq"} className="mockup-section mockup-section--light text-center">
        <div className="site-container">
          <p className="mockup-eyebrow mockup-eyebrow--dark">
            {faqSection?.eyebrow ?? "Questions You Might Have"}
          </p>
          <h2 className="mockup-heading mockup-heading--dark mt-3">
            {faqSection?.heading ?? "Common Questions"}
          </h2>
          <MockupOrnament dark />
          <div className="mx-auto mt-10 max-w-3xl text-left">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section id={cta?.id ?? "services-cta"} className="mockup-section mockup-section--dark">
        <div className="site-container mockup-services-cta-grid">
          <div>
            <h2 className="mockup-heading max-w-md">
              {cta?.heading ?? "Your Next Step Can Be Gentle"}
            </h2>
            <RichText
              html={
                cta?.body ??
                "<p>You don't need to have it all figured out. Begin with a single conversation—and let clarity unfold from there.</p>"
              }
              className="mockup-body mt-5 max-w-lg opacity-90"
            />
            <SiteButtons
              buttons={
                cta?.buttons?.length
                  ? cta.buttons
                  : [{ label: "Book a Session", href: "/booking", variant: "primary" as const, openInNewTab: false }]
              }
              className="mt-8"
              variant="hero"
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-champagne-gold/20 shadow-[0_30px_80px_-30px_rgba(212,175,55,0.3)]">
            <MediaImage
              image={cta?.images?.[0] ?? SEED_IMAGES.sacred}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="absolute inset-0 h-full w-full"
            />
            <div className="mockup-services-cta-glow absolute inset-0" aria-hidden />
          </div>
        </div>
      </section>
    </div>
  );
}
