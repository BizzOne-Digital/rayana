"use client";

import { useEffect } from "react";
import { MockupHomePage } from "@/components/home/MockupHomePage";
import { refreshScrollTriggers } from "@/lib/motion/scroll-trigger";
import type { SectionContext } from "@/lib/sections/registry";
import type { TypedPageSection } from "@/lib/sections/types";

type HomePageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

export function HomePageRenderer({ sections, context }: HomePageRendererProps) {
  useEffect(() => {
    const refresh = () => refreshScrollTriggers();
    refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);
    const introTimer = window.setTimeout(refresh, 4200);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      window.clearTimeout(introTimer);
    };
  }, [sections]);

  return <MockupHomePage sections={sections} context={context} />;
}
