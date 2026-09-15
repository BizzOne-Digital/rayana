"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SiteMainProps = {
  children: React.ReactNode;
};

/** Plain legal pages — no dedicated hero; main needs clearance for the fixed header. */
const LEGAL_PATHS = new Set([
  "/privacy",
  "/terms",
  "/disclaimer",
  "/cancellation-policy",
]);

export function SiteMain({ children }: SiteMainProps) {
  const pathname = usePathname();
  const needsHeaderOffset = LEGAL_PATHS.has(pathname);

  return (
    <main
      id="main-content"
      className={cn(
        "flex-1 min-w-0 w-full max-w-full overflow-x-clip",
        needsHeaderOffset && "site-main--below-header",
      )}
    >
      {children}
    </main>
  );
}
