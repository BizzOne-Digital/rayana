"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/prefs";

type LivingThreadProps = {
  className?: string;
};

export function LivingThread({ className }: LivingThreadProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg || prefersReducedMotion()) return;

    let pointerX = 0.5;
    let scrollProgress = 0;

    function updatePath() {
      if (!path) return;
      const wobble = Math.sin(scrollProgress * Math.PI * 2) * 18;
      const curve = 120 + pointerX * 40 + wobble;
      path.setAttribute(
        "d",
        `M -20 ${200 + wobble * 0.3} Q ${curve} ${180 - scrollProgress * 30} 820 ${200 - scrollProgress * 20}`,
      );
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
      updatePath();
    }

    function onPointerMove(e: PointerEvent) {
      pointerX = e.clientX / window.innerWidth;
      updatePath();
    }

    updatePath();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-24 z-30 h-48 w-full opacity-40 mix-blend-multiply",
        className,
      )}
      viewBox="0 0 800 400"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#D6B66E" />
          <stop offset="50%" stopColor="#B88A44" />
          <stop offset="80%" stopColor="#D6B66E" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        fill="none"
        stroke="url(#threadGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
