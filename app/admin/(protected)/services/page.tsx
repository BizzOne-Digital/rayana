"use client";

import {
  AdminBadge,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { AdminServiceSummary, PaginatedResponse } from "@/lib/admin/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [items, setItems] = useState<AdminServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<PaginatedResponse<AdminServiceSummary>>("/api/admin/services?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Services"
        description="Manage bookable offerings and detail pages."
        breadcrumbs={[{ label: "Services" }]}
        actions={
          <AdminLinkButton href="/admin/services/new">
            <Plus className="h-4 w-4" />
            New service
          </AdminLinkButton>
        }
      />

      <DataTable
        isLoading={loading}
        data={items}
        keyExtractor={(row) => row._id}
        columns={[
          {
            key: "title",
            header: "Service",
            render: (row) => (
              <Link href={`/admin/services/${row._id}`} className="font-medium text-[var(--admin-accent)] hover:underline">
                {row.title}
              </Link>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <AdminBadge tone={row.status === "active" ? "success" : row.status === "coming_soon" ? "warning" : "neutral"}>
                {row.status.replace("_", " ")}
              </AdminBadge>
            ),
          },
          {
            key: "bookable",
            header: "Bookable",
            render: (row) => (row.bookable ? "Yes" : "No"),
          },
          {
            key: "featured",
            header: "Featured",
            render: (row) => (row.featured ? "Yes" : "No"),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <AdminLinkButton href={`/admin/services/${row._id}`} size="sm" variant="secondary">
                Edit
              </AdminLinkButton>
            ),
          },
        ]}
      />
    </>
  );
}
