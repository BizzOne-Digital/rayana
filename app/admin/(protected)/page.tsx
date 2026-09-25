"use client";

import {
  AdminCard,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { IntegrationHealth } from "@/components/admin/IntegrationHealth";
import { CardGridSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import type { DashboardStats } from "@/lib/admin/types";
import {
  FileText,
  HelpCircle,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const content = (
    <AdminCard className="h-full transition-shadow hover:shadow-md">
      <p className="text-sm text-[var(--admin-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--admin-text)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--admin-muted)]">{hint}</p>}
    </AdminCard>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<DashboardStats>("/api/admin/dashboard")
      .then(setStats)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of content, submissions, and site health."
        actions={
          <>
            <AdminLinkButton href="/admin/pages">Edit pages</AdminLinkButton>
            <AdminLinkButton href="/admin/shop" variant="secondary">
              Shop modules
            </AdminLinkButton>
          </>
        }
      />

      {loading ? (
        <CardGridSkeleton count={4} />
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="New contact messages"
              value={stats.submissions.contact}
              hint="Unread in submissions"
              href="/admin/submissions"
            />
            <StatCard
              label="Pending reviews"
              value={stats.submissions.reviews}
              hint="Write-a-review queue"
              href="/admin/submissions"
            />
            <StatCard
              label="Pending testimonials"
              value={stats.submissions.testimonialsPending}
              hint="Awaiting approval"
              href="/admin/testimonials"
            />
            <StatCard
              label="Active services"
              value={stats.services}
              hint={`${stats.pages} published pages`}
              href="/admin/services"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <AdminCard title="Quick actions" className="xl:col-span-1">
              <div className="space-y-2">
                {[
                  { href: "/admin/services/new", label: "Add service", icon: Sparkles },
                  { href: "/admin/shop", label: "Shop modules", icon: ShoppingBag },
                  { href: "/admin/faqs", label: "Manage FAQs", icon: HelpCircle },
                  { href: "/admin/testimonials", label: "Review testimonials", icon: Star },
                  { href: "/admin/submissions", label: "View submissions", icon: MessageSquare },
                  { href: "/admin/pages", label: "Edit pages", icon: FileText },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 rounded-lg border border-[var(--admin-border)] px-3 py-2.5 text-sm transition-colors hover:border-[var(--admin-accent)] hover:bg-[var(--admin-accent-soft)]/30"
                    >
                      <Icon className="h-4 w-4 text-[var(--admin-accent)]" />
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            </AdminCard>

            <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
              <AdminCard>
                <p className="text-sm text-[var(--admin-muted)]">Published pages</p>
                <p className="mt-1 text-2xl font-semibold">{stats.pages}</p>
              </AdminCard>
              <AdminCard>
                <p className="text-sm text-[var(--admin-muted)]">Shop products</p>
                <p className="mt-1 text-2xl font-semibold">{stats.content.products}</p>
              </AdminCard>
              <AdminCard>
                <p className="text-sm text-[var(--admin-muted)]">Blog posts</p>
                <p className="mt-1 text-2xl font-semibold">{stats.content.blogPosts}</p>
              </AdminCard>
              <AdminCard>
                <p className="text-sm text-[var(--admin-muted)]">Gallery images</p>
                <p className="mt-1 text-2xl font-semibold">{stats.content.galleryImages}</p>
              </AdminCard>
            </div>
          </div>

          <IntegrationHealth items={stats.integrations ?? []} />
        </div>
      ) : (
        <AdminCard>
          <p className="text-sm text-[var(--admin-muted)]">
            Dashboard data is unavailable. Check your API connection and try refreshing.
          </p>
        </AdminCard>
      )}
    </>
  );
}
