import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import type { PublicService, PublicSettings, PublicTestimonial } from "@/lib/sections/types";
import { formatCurrency } from "@/lib/utils";

type ServiceDetailPageViewProps = {
  service: PublicService;
  testimonial?: PublicTestimonial | null;
  settings: PublicSettings;
};

function MockupOrnament() {
  return (
    <div className="mockup-ornament mt-6" aria-hidden>
      <span className="mockup-ornament-line" />
      <Sparkles className="mockup-ornament-icon h-4 w-4" />
      <span className="mockup-ornament-line" />
    </div>
  );
}

export function ServiceDetailPageView({
  service,
  testimonial,
  settings,
}: ServiceDetailPageViewProps) {
  const hero = service.detailPage.hero;
  const introImage = service.detailPage.gallery[0] ?? service.mainImage;
  const priceLabel =
    service.pricePreview ||
    (service.standardPrice
      ? formatCurrency(service.standardPrice, settings.payments?.defaultCurrency ?? "CAD")
      : null);

  return (
    <article className="mockup-service-detail-page">
      {/* Hero — dark, centered, no image */}
      <section className="mockup-services-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          {service.badge ? (
            <p className="mockup-eyebrow">{service.badge}</p>
          ) : null}
          <h1 className="mockup-services-hero-heading mt-3">
            {hero.heading || service.title}
          </h1>
          {(hero.subheading || service.shortDescription) && (
            <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
              {hero.subheading || service.shortDescription}
            </p>
          )}
          {hero.promise ? (
            <p className="mockup-body mx-auto mt-3 max-w-lg text-sm opacity-85">{hero.promise}</p>
          ) : null}
          {hero.chips.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-champagne-gold/30 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-rose-mist/90"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link href="/booking" className="btn btn-hero-primary inline-flex">
              {service.detailPage.bookingCta.buttonLabel}
            </Link>
            {priceLabel ? (
              <span className="text-sm text-rose-mist/80">{priceLabel}</span>
            ) : null}
          </div>
          <MockupOrnament />
        </div>
        <div className="mockup-services-hero-curve" aria-hidden />
      </section>

      {/* Introduction — white */}
      <section className="mockup-section mockup-section--light">
        <div className="site-container mockup-service-detail-grid">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-24px_rgba(38,2,13,0.18)]">
            <MediaImage
              image={introImage}
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div>
            <p className="mockup-eyebrow mockup-eyebrow--dark">Introduction</p>
            <h2 className="mockup-heading mockup-heading--dark mt-3">{service.title}</h2>
            <RichText
              html={`<p>${service.detailPage.introduction}</p><p>${service.detailPage.audience}</p>`}
              className="mockup-body mockup-body--dark mt-5 space-y-4"
            />
            {service.detailPage.practicalDetails ? (
              <p className="mockup-body mockup-body--dark mt-6 text-sm opacity-90">
                {service.detailPage.practicalDetails}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* What we explore — dark */}
      <section className="mockup-section mockup-section--dark text-center">
        <div className="site-container">
          <p className="mockup-eyebrow">Focus Areas</p>
          <h2 className="mockup-heading mt-3">What We May Explore</h2>
          <MockupOrnament />
          <ul className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {service.detailPage.explorationTopics.map((topic) => (
              <li
                key={topic}
                className="rounded-[1rem] border border-champagne-gold/18 bg-[rgba(46,4,8,0.45)] px-5 py-4"
              >
                <span className="mockup-body text-sm opacity-92">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process & benefits — white */}
      <section className="mockup-section mockup-section--light">
        <div className="site-container grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mockup-eyebrow mockup-eyebrow--dark">The Journey</p>
            <h2 className="mockup-heading mockup-heading--dark mt-3">Process & Expectations</h2>
            <RichText
              html={`<p>${service.detailPage.process}</p><p>${service.detailPage.expectations}</p>`}
              className="mockup-body mockup-body--dark mt-5 space-y-4"
            />
          </div>
          <div>
            <p className="mockup-eyebrow mockup-eyebrow--dark">Outcomes</p>
            <h3 className="mockup-heading mockup-heading--dark mt-3 text-2xl">Benefits</h3>
            <ul className="mt-6 space-y-3">
              {service.detailPage.benefits.map((benefit) => (
                <li key={benefit} className="mockup-check-item">
                  <Check className="mockup-check-icon h-4 w-4 shrink-0 text-[#7e1638]" />
                  <span className="text-[#25151b]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonial — dark */}
      {testimonial ? (
        <section className="mockup-section mockup-section--dark text-center">
          <div className="site-container max-w-3xl">
            <p className="mockup-eyebrow">Kind Words</p>
            <blockquote className="mockup-about-quote-text mt-6">
              “{testimonial.quote}”
            </blockquote>
            <p className="mt-6 text-sm text-rose-mist/80">
              {testimonial.name}
              {testimonial.role ? ` · ${testimonial.role}` : ""}
            </p>
          </div>
        </section>
      ) : null}

      {/* Booking CTA — dark */}
      <section className="mockup-section mockup-section--dark mockup-section--cta text-center">
        <div className="site-container max-w-2xl">
          <h2 className="mockup-heading">{service.detailPage.bookingCta.heading}</h2>
          <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
            {service.detailPage.bookingCta.body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/booking" className="btn btn-hero-primary inline-flex">
              {service.detailPage.bookingCta.buttonLabel}
            </Link>
            <Link href="/services" className="mockup-outline-btn inline-flex">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
