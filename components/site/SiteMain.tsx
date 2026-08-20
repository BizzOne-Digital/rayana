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

function hasFullBleedHero(pathname: string): boolean {
  if (MOCKUP_HERO_PATHS.has(pathname)) return true;
  return pathname.startsWith("/services/") && pathname.length > "/services/".length;
}

export function SiteMain({ children }: SiteMainProps) {
  const pathname = usePathname();
  const hasMockupHero = hasFullBleedHero(pathname);

  return (
    <main
      id="main-content"
      className={cn("flex-1 min-w-0 w-full max-w-full overflow-x-clip", !hasMockupHero && "pt-24 md:pt-28")}
    >
      {children}
    </main>
  );
}
