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

type ClipRevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up";
};

export function ClipReveal({ children, className, direction = "left" }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1 });
      return;
    }

    const clipFrom =
      direction === "right"
        ? "inset(0% 0% 0% 100%)"
        : direction === "up"
          ? "inset(100% 0% 0% 0%)"
          : "inset(0% 100% 0% 0%)";

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        el,
        { clipPath: clipFrom, opacity: 0.85, scale: 1.03 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.inOut",
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
      clearGsapInlineStyles(el);
    };
  }, [direction]);

  return (
    <div ref={ref} className={cn("relative h-full w-full will-change-[clip-path,transform]", className)}>
      {children}
    </div>
  );
}
