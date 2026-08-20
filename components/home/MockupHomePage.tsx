"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, UserRound, Users } from "lucide-react";
import { HeroCinematic } from "@/components/home/HeroCinematic";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SiteButtons } from "@/components/ui/SiteButton";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionContext } from "@/lib/sections/registry";
import type {
  PublicBlogPost,
  PublicService,
  PublicTestimonial,
  TypedPageSection,
} from "@/lib/sections/types";

type MockupHomePageProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

const SERVICE_META = [
  { icon: UserRound, cta: "Explore Sessions" },
  { icon: BookOpen, cta: "Explore Teachings" },
  { icon: Users, cta: "View Experiences" },
];

const DEFAULT_TESTIMONIALS: PublicTestimonial[] = [
  {
    slug: "anita-r",
    name: "Anita R.",
    quote:
      "Rayana helped me see what I could not see alone. Her presence is gentle, precise, and deeply transformative.",
    excerpt: "",
    featured: true,
    showFullName: true,
    role: "Vancouver, BC",
  },
  {
    slug: "david-m",
    name: "David M.",
    quote:
      "Working with Rayana brought clarity to patterns I had carried for years. I finally understand what my heart was asking for.",
    excerpt: "",
    featured: true,
    showFullName: true,
    role: "Toronto, ON",
  },
  {
    slug: "sarah-l",
    name: "Sarah L.",
    quote:
      "The teachings opened a doorway I didn't know existed. I feel more present, more honest, and more free.",
    excerpt: "",
    featured: true,
    showFullName: true,
    role: "Calgary, AB",
  },
];

const DEFAULT_POSTS: PublicBlogPost[] = [
  {
    title: "What Your Heart Is Trying to Tell You",
    slug: "courage-to-see",
    excerpt: "Learning to listen beneath the noise of everyday life.",
    body: "",
    heroImage: SEED_IMAGES.sacred,
    author: "Rayana De Silva",
    categories: ["Insight"],
    readingTimeMinutes: 5,
    seo: {},
  },
  {
    title: "The Practice of Inner Listening",
    slug: "inner-listening",
    excerpt: "A gentle practice for returning to what is true.",
    body: "",
    heroImage: SEED_IMAGES.teaching,
    author: "Rayana De Silva",
    categories: ["Practice"],
    readingTimeMinutes: 4,
    seo: {},
  },
  {
    title: "Why Clarity Begins with Honesty",
    slug: "clarity-honesty",
    excerpt: "On seeing clearly before trying to change anything.",
    body: "",
    heroImage: SEED_IMAGES.workshop,
    author: "Rayana De Silva",
    categories: ["Teaching"],
    readingTimeMinutes: 6,
    seo: {},
  },
];

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
  const offerings = findSection(sections, "home-offerings");
  const heart = findSection(sections, "home-heart");
  const testimonialsSection = findSection(sections, "home-testimonials");
  const insights = findSection(sections, "home-insights");
  const cta = findSection(sections, "home-cta");

  const services = useMemo(() => {
    let list = (context?.services ?? []).filter((s) => s.featured).slice(0, 3);
    if (list.length < 3) {
      list = (context?.services ?? []).slice(0, 3);
    }
    return list;
  }, [context?.services]);

  const testimonials = useMemo(() => {
    const list = (context?.testimonials ?? []).filter((t) => t.featured).slice(0, 6);
    return list.length >= 3 ? list : DEFAULT_TESTIMONIALS;
  }, [context?.testimonials]);

  const posts = useMemo(() => {
    const list = (context?.blogPosts ?? []).slice(0, 3);
    return list.length >= 3 ? list : DEFAULT_POSTS;
  }, [context?.blogPosts]);

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
              {welcome?.heading ?? "Return to the Wisdom of Your Heart"}
            </h2>
            <RichText
              html={
                welcome?.body ??
                "<p>Rayana De Silva is a master of heart matters—channeler, educator, and guide for those ready to see beneath the surface of their lives. Through private sessions, teachings, and group experiences, she helps you return to the wisdom already alive within you.</p>"
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

      {/* Signature Offerings — dark */}
      <section id={offerings?.id ?? "home-offerings"} className="mockup-section mockup-section--dark">
        <div className="site-container text-center">
          <p className="mockup-eyebrow">{offerings?.eyebrow ?? "Ways to Work Together"}</p>
          <h2 className="mockup-heading mt-3">{offerings?.heading ?? "Signature Offerings"}</h2>
          <MockupOrnament />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
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

      {/* Heart Remembers — white */}
      <section id={heart?.id ?? "home-heart"} className="mockup-section mockup-section--light">
        <div className="site-container mockup-heart-grid">
          <div>
            <h2 className="mockup-heading mockup-heading--dark">
              {heart?.heading ?? "The Heart Remembers"}
            </h2>
            <RichText
              html={
                heart?.body ??
                "<p>Beneath the stories we tell ourselves lives a deeper knowing—quiet, steady, and true. Rayana's work invites you back to that place: where clarity is not forced, but remembered.</p>"
              }
              className="mockup-body mockup-body--dark mt-6 max-w-lg"
            />
            <blockquote className="mockup-pull-quote mt-8">
              “The heart holds the map. The soul knows the way.”
            </blockquote>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.2)]">
            <MediaImage
              image={heart?.images?.[0] ?? SEED_IMAGES.hands}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* Testimonials — dark */}
      <section id={testimonialsSection?.id ?? "home-testimonials"} className="mockup-section mockup-section--dark">
        <div className="site-container text-center">
          <p className="mockup-eyebrow">{testimonialsSection?.eyebrow ?? "Kind Words"}</p>
          <h2 className="mockup-heading mt-3">
            {testimonialsSection?.heading ?? "From the Heart"}
          </h2>
          <MockupOrnament />

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
                  <blockquote className="mockup-testimonial-quote">“{item.quote}”</blockquote>
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

      {/* Insights — white */}
      <section id={insights?.id ?? "home-insights"} className="mockup-section mockup-section--light">
        <div className="site-container text-center">
          <p className="mockup-eyebrow mockup-eyebrow--dark">
            {insights?.eyebrow ?? "Insights & Teachings"}
          </p>
          <h2 className="mockup-heading mockup-heading--dark mt-3">
            {insights?.heading ?? "Guidance for Your Journey"}
          </h2>
          <MockupOrnament />

          <div className="mt-12 grid gap-6 text-left lg:grid-cols-3">
            {posts.map((post) => {
              const image = post.heroImage ?? SEED_IMAGES.nature;
              const category = post.categories?.[0] ?? "Insight";
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="mockup-insight-card group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <MediaImage
                      image={image}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="absolute inset-0 h-full w-full"
                      imageClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-7">
                    <p className="mockup-eyebrow mockup-eyebrow--dark text-[0.58rem]">{category}</p>
                    <h3 className="mockup-card-title mockup-card-title--dark mt-2">{post.title}</h3>
                    {post.excerpt ? (
                      <p className="mockup-body mockup-body--dark mt-3 text-sm">{post.excerpt}</p>
                    ) : null}
                    <span className="mockup-card-link mockup-card-link--dark mt-5 inline-flex">
                      Read Article →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
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
                  : [{ label: "Book a Session", href: "/booking", variant: "primary" as const, openInNewTab: false }]
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
