import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import {
  getPublicService,
  getPublicServices,
  getPublicSettings,
  getPublicTestimonials,
} from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCurrency } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getPublicService(slug),
    getPublicSettings(),
  ]);
  if (!service) return {};
  return buildMetadata({
    title: service.detailPage.seo.title || service.title,
    description: service.detailPage.seo.description || service.shortDescription,
    settings,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, services, testimonials, settings] = await Promise.all([
    getPublicService(slug),
    getPublicServices(),
    getPublicTestimonials({ limit: 1 }),
    getPublicSettings(),
  ]);

  if (!service) notFound();

  const heroImage = service.detailPage.hero.image ?? service.mainImage;
  const gallery = service.detailPage.gallery.length
    ? service.detailPage.gallery
    : [service.mainImage, heroImage, ...services.slice(0, 3).map((s) => s.mainImage)].slice(0, 6);

  return (
    <article>
      <section className="section-padding theme-burgundy texture-velvet texture-grain text-warm-ivory">
        <div className="site-container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            {service.badge ? <p className="eyebrow mb-4 text-soft-rose">{service.badge}</p> : null}
            <h1 className="display-heading text-4xl md:text-5xl text-balance">
              {service.detailPage.hero.heading || service.title}
            </h1>
            <p className="mt-4 text-lg text-rose-mist/90">
              {service.detailPage.hero.subheading || service.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {service.detailPage.hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-champagne-gold/30 px-3 py-1 text-xs uppercase tracking-wider"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/booking" className="btn btn-primary">
                {service.detailPage.bookingCta.buttonLabel}
              </Link>
              <span className="self-center text-sm text-rose-mist/80">
                {service.pricePreview ||
                  (service.standardPrice
                    ? formatCurrency(service.standardPrice, settings.payments?.defaultCurrency ?? "CAD")
                    : null)}
              </span>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
            <MediaImage image={heroImage} priority sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="site-container asymmetric-grid">
          <ScrollReveal>
            <h2 className="display-heading text-3xl md:text-4xl mb-6">Introduction</h2>
            <RichText html={`<p>${service.detailPage.introduction}</p>`} />
            <RichText html={`<p>${service.detailPage.audience}</p>`} className="mt-6" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] shadow-soft">
              <MediaImage image={gallery[1] ?? service.mainImage} sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-parchment texture-grain">
        <div className="site-container">
          <h2 className="display-heading text-3xl mb-8">What We May Explore</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.detailPage.explorationTopics.map((topic) => (
              <li
                key={topic}
                className="rounded-2xl border border-border bg-warm-ivory px-5 py-4 text-sm"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="site-container grid gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="display-heading text-3xl mb-4">Process & Expectations</h2>
            <RichText html={`<p>${service.detailPage.process}</p><p>${service.detailPage.expectations}</p>`} />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h3 className="font-display text-2xl mb-4">Benefits</h3>
            <ul className="space-y-2">
              {service.detailPage.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2 text-sm">
                  <span className="text-champagne-gold">◆</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="site-container grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className={`relative overflow-hidden rounded-2xl shadow-soft ${index === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[360px]" : "aspect-square"}`}
            >
              <MediaImage image={image} sizes="(max-width: 768px) 50vw, 33vw" />
            </div>
          ))}
        </div>
      </section>

      {testimonials[0] ? (
        <section className="section-padding bg-surface-elevated">
          <div className="site-container max-w-3xl">
            <blockquote className="font-display text-2xl md:text-3xl text-velvet-night">
              “{testimonials[0].quote}”
            </blockquote>
          </div>
        </section>
      ) : null}

      <section className="section-padding">
        <div className="site-container rounded-[2rem] bg-deep-burgundy px-8 py-12 text-warm-ivory texture-grain md:px-12">
          <h2 className="font-display text-3xl">{service.detailPage.bookingCta.heading}</h2>
          <p className="mt-3 max-w-2xl text-rose-mist/90">{service.detailPage.bookingCta.body}</p>
          <Link href="/booking" className="btn btn-primary mt-8 inline-flex">
            {service.detailPage.bookingCta.buttonLabel}
          </Link>
        </div>
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map((service) => ({ slug: service.slug }));
}
