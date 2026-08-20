"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type AdminBreadcrumb = {
  label: string;
  href?: string;
};

type AdminHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: AdminBreadcrumb[];
  actions?: ReactNode;
};

export function AdminHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: AdminHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-[var(--admin-border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 pt-12 lg:pt-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--admin-muted)]" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-accent)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--admin-text)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-text)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm text-[var(--admin-muted)]">{description}</p>
        )}
      </div>
      {actions && (
        <div className={cn("flex flex-wrap items-center gap-2 lg:shrink-0 lg:pt-0", "pt-0")}>
          {actions}
        </div>
      )}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm",
        variant === "primary" &&
          "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)]",
        variant === "secondary" &&
          "border border-[var(--admin-border)] bg-white text-[var(--admin-text)] hover:bg-[var(--admin-surface)]",
        variant === "ghost" &&
          "text-[var(--admin-muted)] hover:bg-[var(--admin-surface)] hover:text-[var(--admin-text)]",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminLinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm",
        variant === "primary" &&
          "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)]",
        variant === "secondary" &&
          "border border-[var(--admin-border)] bg-white text-[var(--admin-text)] hover:bg-[var(--admin-surface)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function AdminCard({
  children,
  className,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--admin-border)] bg-white shadow-sm",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-[var(--admin-border)] px-5 py-4">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-[var(--admin-text)]">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-[var(--admin-muted)]">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function AdminBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-slate-100 text-slate-700",
        tone === "success" && "bg-emerald-100 text-emerald-700",
        tone === "warning" && "bg-amber-100 text-amber-800",
        tone === "danger" && "bg-red-100 text-red-700",
        tone === "accent" && "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]",
      )}
    >
      {children}
    </span>
  );
}

export function AdminTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: string; label: string; count?: number }>;
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--admin-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            active === tab.id
              ? "border-[var(--admin-accent)] text-[var(--admin-accent)]"
              : "border-transparent text-[var(--admin-muted)] hover:text-[var(--admin-text)]",
          )}
        >
          {tab.label}
          {typeof tab.count === "number" && (
            <span className="ml-2 rounded-full bg-[var(--admin-surface)] px-2 py-0.5 text-xs">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function AdminField({
  label,
  error,
  hint,
  children,
  required,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--admin-text)]">
        {label}
        {required && <span className="text-[var(--admin-accent)]"> *</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="block text-xs text-[var(--admin-muted)]">{hint}</span>
      )}
      {error && <span className="block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-[var(--admin-border)] bg-white px-3 py-2 text-sm text-[var(--admin-text)] outline-none transition-colors placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)]",
        props.className,
      )}
    />
  );
}

export function AdminTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-lg border border-[var(--admin-border)] bg-white px-3 py-2 text-sm text-[var(--admin-text)] outline-none transition-colors placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)]",
        props.className,
      )}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border border-[var(--admin-border)] bg-white px-3 py-2 text-sm text-[var(--admin-text)] outline-none transition-colors focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)]",
        props.className,
      )}
    />
  );
}
