"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type GoldenThreadDividerProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function GoldenThreadDivider({ variant = "dark", className }: GoldenThreadDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = ref.current;
    const path = pathRef.current;
    if (!el || !path) return;

    if (prefersReducedMotion()) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "home-thread-divider relative py-8 md:py-12",
        variant === "light" ? "home-thread-divider--light" : "home-thread-divider--dark",
        className,
      )}
      aria-hidden
    >
      <svg
        className="mx-auto h-8 w-full max-w-4xl"
        viewBox="0 0 800 32"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M0 16 C120 4, 200 28, 320 16 S520 4, 640 16 S760 28, 800 16"
          fill="none"
          stroke="url(#homeThreadGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="homeThreadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f8edd5" />
            <stop offset="85%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
