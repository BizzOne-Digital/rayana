"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SEED_IMAGES } from "@/lib/data/seed-images";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-padding min-h-[60vh] flex items-center">
      <div className="site-container max-w-2xl">
        <p className="eyebrow mb-4">Something went awry</p>
        <h1 className="display-heading text-4xl md:text-5xl">
          A moment of interruption
        </h1>
        <p className="mt-4 text-muted-stone">
          Please try again. If the issue persists, you are welcome to reach out directly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-secondary">
            Return Home
          </Link>
        </div>
        <img
          src={SEED_IMAGES.texture.url}
          alt=""
          className="mt-10 h-24 w-full rounded-2xl object-cover opacity-70"
        />
      </div>
    </section>
  );
}
