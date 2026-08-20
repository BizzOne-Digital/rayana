"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldEnableSmoothScroll } from "@/lib/motion/prefs";
import { refreshScrollTriggers } from "@/lib/motion/scroll-trigger";

type SmoothScrollProps = {
  children: React.ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!shouldEnableSmoothScroll()) {
      refreshScrollTriggers();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => refreshScrollTriggers();
    refresh();
    window.addEventListener("load", refresh);
    const timer = window.setTimeout(refresh, 500);
    const introTimer = window.setTimeout(refresh, 4200);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(introTimer);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
