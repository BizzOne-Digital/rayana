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
import { formatCurrency } from "@/lib/utils";
import {
  CalendarDays,
  FileText,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
        description="Overview of bookings, content, and site health."
        actions={
          <>
            <AdminLinkButton href="/admin/bookings" variant="secondary">
              View bookings
            </AdminLinkButton>
            <AdminLinkButton href="/admin/pages">Edit pages</AdminLinkButton>
          </>
        }
      />

      {loading ? (
        <CardGridSkeleton count={4} />
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Upcoming bookings"
              value={stats.bookings.upcoming}
              hint={`${stats.bookings.pending} pending payment`}
              href="/admin/bookings"
            />
            <StatCard
              label="Booking revenue"
              value={formatCurrency(stats.bookings.revenue)}
              hint={`${stats.bookings.total} total bookings`}
              href="/admin/bookings"
            />
            <StatCard
              label="Pending testimonials"
              value={stats.submissions.testimonialsPending}
              hint="Awaiting approval"
              href="/admin/testimonials"
            />
            <StatCard
              label="New submissions"
              value={stats.submissions.contact + stats.submissions.reviews}
              hint="Contact + reviews"
              href="/admin/submissions"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <AdminCard
              title="Booking activity"
              description="Sessions booked over the last 30 days."
              className="xl:col-span-2"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.bookingChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4d6cf" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        borderColor: "#e4d6cf",
                      }}
                    />
                    <Bar dataKey="count" fill="#7b2433" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AdminCard>

            <AdminCard title="Quick actions">
              <div className="space-y-2">
                {[
                  { href: "/admin/services/new", label: "Add service", icon: Sparkles },
                  { href: "/admin/blog/new", label: "New blog post", icon: FileText },
                  { href: "/admin/bookings", label: "Manage bookings", icon: CalendarDays },
                  { href: "/admin/testimonials", label: "Review testimonials", icon: Star },
                  { href: "/admin/submissions", label: "View submissions", icon: MessageSquare },
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
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <AdminCard>
              <p className="text-sm text-[var(--admin-muted)]">Published pages</p>
              <p className="mt-1 text-2xl font-semibold">{stats.pages}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-sm text-[var(--admin-muted)]">Active services</p>
              <p className="mt-1 text-2xl font-semibold">{stats.services}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-sm text-[var(--admin-muted)]">Blog posts</p>
              <p className="mt-1 text-2xl font-semibold">{stats.content.blogPosts}</p>
            </AdminCard>
          </div>

          <IntegrationHealth items={stats.integrations} />
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
