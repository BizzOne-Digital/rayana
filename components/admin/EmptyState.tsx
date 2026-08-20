import { AdminButton, AdminLinkButton } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  children?: ReactNode;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)]/40 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--admin-text)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--admin-muted)]">{description}</p>
      {children}
      {(actionLabel && actionHref) || (actionLabel && onAction) ? (
        <div className="mt-6">
          {actionHref ? (
            <AdminLinkButton href={actionHref}>{actionLabel}</AdminLinkButton>
          ) : (
            <AdminButton onClick={onAction}>{actionLabel}</AdminButton>
          )}
        </div>
      ) : null}
    </div>
  );
}
