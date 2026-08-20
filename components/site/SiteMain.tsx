"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SiteMainProps = {
  children: React.ReactNode;
};

/** Pages whose first section is a full-bleed mockup hero under the fixed header. */
const MOCKUP_HERO_PATHS = new Set([
  "/",
  "/about",
  "/services",
  "/testimonials",
  "/faqs",
  "/contact",
]);

export function SiteMain({ children }: SiteMainProps) {
  const pathname = usePathname();
  const hasMockupHero = MOCKUP_HERO_PATHS.has(pathname);

  return (
    <main
      id="main-content"
      className={cn("flex-1 min-w-0 w-full max-w-full overflow-x-clip", !hasMockupHero && "pt-24 md:pt-28")}
    >
      {children}
    </main>
  );
}
