"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/write-a-review", "/admin"];

export function FloatingWriteReviewCta() {
  const pathname = usePathname() ?? "";

  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (hidden) return null;

  return (
    <Link
      href="/write-a-review"
      className={cn(
        "fixed bottom-6 right-4 z-40 flex max-w-[min(100vw-2rem,16rem)] items-center gap-2 rounded-full",
        "border border-champagne-gold/30 bg-warm-ivory/95 px-4 py-3 text-sm font-semibold text-velvet-night shadow-soft backdrop-blur-sm",
        "transition-transform hover:scale-[1.02] hover:border-heart-wine/40 hover:text-heart-wine",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heart-wine",
        "sm:bottom-8 sm:right-8",
      )}
      aria-label="Write a review of your experience"
    >
      <PenLine className="h-4 w-4 shrink-0 text-heart-wine" aria-hidden />
      <span>Write a review</span>
    </Link>
  );
}
