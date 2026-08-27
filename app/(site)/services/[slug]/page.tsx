import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { ServiceDetailPageView } from "@/components/services/ServiceDetailPageView";
import {
  getPublicService,
  getPublicServices,
  getPublicSettings,
  getPublicTestimonials,
} from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

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

  if (slug === "wisdom-mentoring") {
    redirect("/services/private-consultations#wisdom-mentoring");
  }

  const [service, services, testimonials, settings] = await Promise.all([
    getPublicService(slug),
    getPublicServices(),
    getPublicTestimonials({ limit: 1 }),
    getPublicSettings(),
  ]);

  if (!service) notFound();

  const companionServices =
    slug === "private-consultations"
      ? services.filter((item) => item.slug === "wisdom-mentoring")
      : [];

  return (
    <ServiceDetailPageView
      service={service}
      testimonial={testimonials[0] ?? null}
      settings={settings}
      companionServices={companionServices}
    />
  );
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map((service) => ({ slug: service.slug }));
}
