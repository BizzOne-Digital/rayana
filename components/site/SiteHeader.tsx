"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicSettings } from "@/lib/sections/types";

type SiteHeaderProps = {
  settings: PublicSettings;
};

const CORE_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const ctaLabel = settings.header.primaryCtaLabel || "Book a Session";
  const ctaHref = settings.header.primaryCtaHref || "/booking";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5",
        isHome ? "pointer-events-none" : "",
      )}
    >
      <div className="site-container pointer-events-auto max-w-[88rem]">
        <div className="header-glass flex min-w-0 items-center justify-between gap-2 rounded-full px-2 py-1.5 sm:gap-3 sm:px-3 md:px-5 md:py-2">
          <Link
            href="/"
            className="header-logo-circle relative block h-10 w-10 shrink-0 overflow-hidden rounded-full sm:h-11 sm:w-11 md:h-12 md:w-12"
            aria-label="Rayana De Silva — Heart Matters"
          >
            <Image
              src="/brand/rayana-logo.png"
              alt="Rayana De Silva"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              className="object-contain object-center p-[2px]"
              priority
            />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-10"
            aria-label="Primary"
          >
            {CORE_NAV.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "header-nav-link py-2 text-[0.62rem] font-medium uppercase tracking-[0.28em] transition-colors xl:text-[0.68rem]",
                    active
                      ? "text-[#e8c97a]"
                      : "text-[#d4af37]/80 hover:text-[#e8c97a]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link href={ctaHref} className="btn-header-cta hidden md:inline-flex">
              {ctaLabel}
            </Link>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/30 text-[#d4af37] lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open ? (
          <div
            className="header-glass mt-2 overflow-hidden rounded-3xl lg:hidden"
            data-lenis-prevent
          >
            <nav className="flex flex-col gap-0.5 p-3" aria-label="Mobile">
              {CORE_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-xs font-medium uppercase tracking-[0.22em] transition-colors",
                    pathname === link.href
                      ? "bg-[#d4af37]/10 text-[#e8c97a]"
                      : "text-[#d4af37]/85 hover:bg-[#d4af37]/5 hover:text-[#e8c97a]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={ctaHref} className="btn-header-cta mt-2 w-full justify-center">
                {ctaLabel}
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
