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

type StaggerRevealProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  selector?: string;
};

export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  y = 36,
  selector = ":scope > *",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll(selector);
    if (!items.length) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger,
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
      clearGsapInlineStyles(items);
    };
  }, [selector, stagger, y]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
