"use client";

import {
  AdminBadge,
  AdminCard,
} from "@/components/admin/AdminHeader";
import type { IntegrationHealthItem, IntegrationStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  CloudUpload,
  CreditCard,
  Database,
  Mail,
  XCircle,
} from "lucide-react";

const statusConfig: Record<
  IntegrationStatus,
  { label: string; tone: "success" | "warning" | "danger" | "neutral"; icon: typeof CheckCircle2 }
> = {
  healthy: { label: "Healthy", tone: "success", icon: CheckCircle2 },
  degraded: { label: "Degraded", tone: "warning", icon: CheckCircle2 },
  offline: { label: "Offline", tone: "danger", icon: XCircle },
  unknown: { label: "Unknown", tone: "neutral", icon: CheckCircle2 },
};

const iconMap = {
  mongodb: Database,
  smtp: Mail,
  stripe: CreditCard,
  uploads: CloudUpload,
} as const;

type IntegrationHealthProps = {
  items: IntegrationHealthItem[];
  compact?: boolean;
};

export function IntegrationHealth({ items, compact }: IntegrationHealthProps) {
  return (
    <AdminCard
      title="Integration health"
      description="Live status of connected services and infrastructure."
    >
      <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4")}>
        {items.map((item) => {
          const config = statusConfig[item.status];
          const Icon = iconMap[item.key];
          const StatusIcon = config.icon;
          return (
            <div
              key={item.key}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[var(--admin-accent)] shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[var(--admin-text)]">
                    {item.label}
                  </span>
                </div>
                <AdminBadge tone={config.tone}>{config.label}</AdminBadge>
              </div>
              <div className="flex items-start gap-2 text-sm text-[var(--admin-muted)]">
                <StatusIcon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    item.status === "healthy" && "text-emerald-600",
                    item.status === "degraded" && "text-amber-600",
                    item.status === "offline" && "text-red-600",
                    item.status === "unknown" && "text-slate-500",
                  )}
                />
                <span>{item.message ?? "No additional details available."}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AdminCard>
  );
}
