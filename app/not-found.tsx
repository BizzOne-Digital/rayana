import Link from "next/link";
import { MediaImage } from "@/components/site/MediaImage";
import { SEED_IMAGES } from "@/lib/data/seed-images";

export default function NotFound() {
  return (
    <section className="section-padding min-h-[60vh] flex items-center texture-parchment">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="eyebrow mb-4">404</p>
          <h1 className="display-heading text-4xl md:text-5xl text-balance">
            This path does not lead where you hoped
          </h1>
          <p className="mt-4 text-muted-stone max-w-lg">
            The page you are looking for may have moved, or the address may be incomplete.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              Return Home
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Rayana
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
          <MediaImage image={SEED_IMAGES.landscape} sizes="(max-width: 1024px) 100vw, 40vw" />
        </div>
      </div>
    </section>
  );
}
