"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { SiteButtons } from "@/components/ui/SiteButton";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import type { SectionProps } from "@/lib/sections/registry";

const METHOD_LABELS = ["See", "Understand", "Integrate"];

function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function HeroCinematic({ section }: SectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const subtext = stripHtml(section.body);
  const isMockup = section.layoutVariant === "mockup";

  useEffect(() => {
    if (prefersReducedMotion() || !copyRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.15, ease: "power3.out" },
      );

      if (!isMockup) {
        gsap.fromTo(
          ".hero-method-row",
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.15,
            delay: 0.55,
            ease: "power3.out",
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [isMockup]);

  return (
    <section ref={rootRef} className="hero-cinematic relative min-h-[100dvh] overflow-hidden">
      <Image
        src="/images/hero/heart-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-cinematic-bg scale-105 object-cover object-[68%_center] md:object-[72%_center]"
        aria-hidden
      />

      <div className="hero-cinematic-overlay pointer-events-none absolute inset-0" />
      <div className="hero-cinematic-grain pointer-events-none absolute inset-0" />
      <div className="hero-cinematic-thread pointer-events-none absolute inset-x-0 bottom-0 h-32" aria-hidden />

      <div className="site-container relative z-10 mx-auto flex min-h-[100dvh] w-full min-w-0 max-w-[88rem] items-center pb-12 pt-24 sm:pb-14 sm:pt-28 md:pb-16 md:pt-32 lg:pt-36">
        <div
          className={
            isMockup
              ? "grid w-full min-w-0 max-w-3xl items-center"
              : "grid w-full min-w-0 items-center lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)]"
          }
        >
          <div ref={copyRef} className="hero-cinematic-copy min-w-0 w-full max-w-[34rem]">
            <h1 className="hero-cinematic-heading">{section.heading}</h1>
            {subtext ? <p className="hero-cinematic-sub whitespace-pre-line">{subtext}</p> : null}
            <SiteButtons
              buttons={section.buttons}
              className="hero-cinematic-actions mt-8 justify-start md:mt-10"
              variant="hero"
            />
          </div>

          {!isMockup ? (
            <div className="relative hidden min-h-[520px] lg:block">
              <div className="hero-method-stack">
                {METHOD_LABELS.map((label) => (
                  <div key={label} className="hero-method-row">
                    <span className="hero-method-line" aria-hidden />
                    <span className="hero-method-tag">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {!isMockup ? (
          <div className="mt-8 flex flex-wrap gap-2.5 lg:hidden">
            {METHOD_LABELS.map((label) => (
              <span key={label} className="hero-method-tag text-[0.58rem]">
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { HeroCinematic };
