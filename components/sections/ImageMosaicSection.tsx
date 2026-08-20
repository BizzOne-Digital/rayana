"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { SectionShell } from "@/components/ui/SectionShell";
import { defaultImage } from "@/lib/data/seed-images";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import { clearGsapInlineStyles, ensureTweenVisible, refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionProps } from "@/lib/sections/registry";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ImageMosaicSection({ section }: SectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const images =
    section.images?.length
      ? section.images
      : [defaultImage(0), defaultImage(1), defaultImage(2), defaultImage(3), defaultImage(4)];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  useEffect(() => {
    if (!isEditorial || !gridRef.current || prefersReducedMotion()) return;

    const cells = gridRef.current.querySelectorAll(".home-mosaic-cell");
    if (!cells.length) return;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        cells,
        { opacity: 0, scale: 0.92, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
          },
        },
      );

      requestAnimationFrame(() => {
        refreshScrollTriggers();
        ensureTweenVisible(gridRef.current, tween);
      });
    }, gridRef);

    return () => {
      ctx.revert();
      clearGsapInlineStyles(cells);
    };
  }, [isEditorial, images.length]);

  if (isEditorial) {
    return (
      <section id={section.id} className="home-mosaic section-padding pb-24">
        <div className="site-container">
          {section.eyebrow ? <p className="home-eyebrow-dark mb-5">{section.eyebrow}</p> : null}
          <TextReveal text={section.heading || "Moments of Presence"} as="h2" className="home-section-heading mb-10" />

          <div
            ref={gridRef}
            className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 auto-rows-[130px] md:auto-rows-[170px]"
          >
            {images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className={`home-mosaic-cell relative overflow-hidden rounded-2xl ${
                  index === 0 ? "col-span-2 row-span-2" : index === 4 ? "md:col-span-2" : ""
                }`}
              >
                <MediaImage image={image} sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="home-image-vignette absolute inset-0 opacity-40" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px]">
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="relative min-h-[140px] overflow-hidden rounded-2xl">
            <MediaImage image={image} sizes="50vw" />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
