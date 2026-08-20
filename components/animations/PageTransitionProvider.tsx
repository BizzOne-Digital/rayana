"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/prefs";
import { LivingThread } from "./LivingThread";

type PageTransitionProviderProps = {
  children: React.ReactNode;
};

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const enter = window.setTimeout(() => setVisible(true), 80);
    return () => window.clearTimeout(enter);
  }, [pathname, reduced]);

  return (
    <>
      {!reduced ? <LivingThread /> : null}
      <div
        key={pathname}
        className={cn(
          "flex-1 min-w-0 w-full max-w-full overflow-x-clip",
          !reduced && (visible ? "page-transition-active" : "page-transition-enter"),
        )}
        style={
          reduced
            ? undefined
            : {
                transitionDuration: visible ? "900ms" : "500ms",
              }
        }
      >
        {children}
      </div>
    </>
  );
}
