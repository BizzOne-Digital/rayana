import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { shopProductTier } from "@/lib/data/shop-catalog";
import { cn } from "@/lib/utils";

type ShopModuleCardProps = {
  slug: string;
  title: string;
  tagline: string;
  price: number;
  currency: string;
  className?: string;
};

function chakraBadge(slug: string) {
  const match = /^chakra-(\d+)$/.exec(slug);
  if (!match) return null;
  return match[1];
}

export function ShopModuleCard({
  slug,
  title,
  tagline,
  price,
  currency,
  className,
}: ShopModuleCardProps) {
  const tier = shopProductTier(slug);
  const number = chakraBadge(slug);
  const isFree = price === 0;

  return (
    <Link
      href={`/shop/${slug}`}
      className={cn(
        "group relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[1.35rem] border border-[#e8dfd2]/90 bg-gradient-to-br from-white via-[#fdfbf7] to-[#f5efe6] p-6 shadow-[0_18px_50px_-28px_rgba(78,5,5,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7e1638]/25 hover:shadow-[0_28px_60px_-24px_rgba(78,5,5,0.28)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#d4af37]/10 blur-2xl transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {number ? (
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm text-white",
                tier === "out-of-body" ? "bg-[#4e0505]" : "bg-[#7e1638]",
              )}
            >
              {number}
            </span>
          ) : (
            <span className="rounded-full bg-[#d4af37]/15 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[#7e1638]">
              Intro
            </span>
          )}
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#7e1638]/90">
            {isFree ? "Free" : formatCurrency(price, currency)}
          </p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-[#7e1638]/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#7e1638]"
          aria-hidden
        />
      </div>
      <h3 className="mt-5 font-display text-xl leading-snug text-velvet-night">{title}</h3>
      <p className="mockup-body mockup-body--dark mt-2 flex-1 text-sm leading-relaxed opacity-85">
        {tagline}
      </p>
      <p className="mt-4 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#7e1638]/70">
        View module
      </p>
    </Link>
  );
}
