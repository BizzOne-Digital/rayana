"use client";

import {
  AdminBadge,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { adminFetch } from "@/lib/admin/api";
import type { AdminPageSummary, PaginatedResponse } from "@/lib/admin/types";
import { format } from "date-fns";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPagesListPage() {
  const [items, setItems] = useState<AdminPageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<PaginatedResponse<AdminPageSummary>>("/api/admin/pages?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load pages"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Pages"
        description="Manage system pages, sections, and SEO."
        breadcrumbs={[{ label: "Pages" }]}
      />

      {!loading && items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No pages found"
          description="Seed the database or create pages to begin editing content."
        />
      ) : (
        <DataTable
          isLoading={loading}
          data={items}
          keyExtractor={(row) => row._id}
          columns={[
            {
              key: "title",
              header: "Page",
              render: (row) => (
                <div>
                  <Link
                    href={`/admin/pages/${row._id}`}
                    className="font-medium text-[var(--admin-accent)] hover:underline"
                  >
                    {row.title}
                  </Link>
                  <p className="text-xs text-[var(--admin-muted)]">{row.systemKey}</p>
                </div>
              ),
            },
            {
              key: "route",
              header: "Route",
              render: (row) => (
                <a
                  href={row.route}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm hover:text-[var(--admin-accent)]"
                >
                  {row.route}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <AdminBadge tone={row.status === "published" ? "success" : "warning"}>
                  {row.status}
                </AdminBadge>
              ),
            },
            {
              key: "updated",
              header: "Updated",
              render: (row) => format(new Date(row.updatedAt), "MMM d, yyyy"),
            },
            {
              key: "actions",
              header: "",
              className: "text-right",
              render: (row) => (
                <AdminLinkButton href={`/admin/pages/${row._id}`} size="sm" variant="secondary">
                  Edit
                </AdminLinkButton>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
