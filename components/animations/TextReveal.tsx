"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import { clearGsapInlineStyles, ensureTweenVisible, refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  split?: "words" | "lines";
};

export function TextReveal({
  text,
  as: Tag = "h2",
  className,
  split = "words",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text.trim()) return;

    if (prefersReducedMotion()) return;

    const units =
      split === "lines"
        ? text.split(". ").filter(Boolean)
        : text.split(/\s+/).filter(Boolean);

    el.innerHTML = units
      .map(
        (unit, i) =>
          `<span class="text-reveal-unit inline-block overflow-hidden align-bottom"><span class="text-reveal-inner inline-block will-change-transform">${unit}${split === "lines" && i < units.length - 1 ? "." : ""}${split === "words" ? "&nbsp;" : " "}</span></span>`,
      )
      .join(split === "lines" ? " " : "");

    const inners = el.querySelectorAll(".text-reveal-inner");
    if (!inners.length) return;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        inners,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.9,
          stagger: 0.045,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );

      requestAnimationFrame(() => {
        refreshScrollTriggers();
        ensureTweenVisible(el, tween);
      });
    }, el);

    return () => {
      ctx.revert();
      clearGsapInlineStyles(inners);
    };
  }, [text, split]);

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {text}
    </Tag>
  );
}
