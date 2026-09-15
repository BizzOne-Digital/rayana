import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { WorkWithMeHub } from "@/components/services/WorkWithMeHub";
import { getPublicServices, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildMetadata({
    title: "Work With Me",
    seo: {
      title: "Work With Me | Rayana De Silva",
      description:
        "Private consultations, wisdom mentoring, teachings, workshops, and more with Rayana De Silva.",
    },
    settings,
    path: "/work-with-me",
  });
}

export default async function WorkWithMePage() {
  const services = await getPublicServices();

  return (
    <div className="mockup-simple-page">
      <section className="mockup-simple-hero mockup-section--dark text-center">
        <div className="site-container max-w-3xl">
          <p className="mockup-eyebrow">Work With Me</p>
          <h1 className="mockup-heading mt-3">Ways to Work Together</h1>
          <p className="mockup-body mx-auto mt-4 max-w-xl opacity-90">
            Choose the offering that fits where you are—each path opens to full details and booking.
          </p>
          <div className="mockup-ornament mt-6" aria-hidden>
            <span className="mockup-ornament-line" />
            <Sparkles className="mockup-ornament-icon h-4 w-4" />
            <span className="mockup-ornament-line" />
          </div>
        </div>
      </section>

      <section className="mockup-section mockup-section--dark">
        <div className="site-container">
          <WorkWithMeHub services={services} limit={5} />
        </div>
      </section>
    </div>
  );
}
