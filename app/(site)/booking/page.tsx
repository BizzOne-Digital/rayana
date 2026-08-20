import type { Metadata } from "next";
import { PageRenderer } from "@/components/sections/PageRenderer";
import { BookingForm } from "@/components/forms/BookingForm";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicServices, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("booking"),
    getPublicSettings(),
  ]);
  return buildMetadata({ title: page?.title, seo: page?.seo, settings, path: "/booking" });
}

export default async function BookingPage() {
  const [page, context, services] = await Promise.all([
    getPublicPage("booking"),
    buildSectionContext(),
    getPublicServices(),
  ]);

  if (!page) return null;

  const bookable = services.filter((s) => s.bookable && s.status === "active");

  return (
    <>
      <PageRenderer sections={page.sections} context={context} />
      <section className="section-padding pt-0">
        <div className="site-container max-w-3xl">
          <BookingForm services={bookable.length ? bookable : services} />
        </div>
      </section>
    </>
  );
}
