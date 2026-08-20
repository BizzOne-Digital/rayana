"use client";

import {
  AdminBadge,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type MediaRow = {
  _id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  publishedAt?: string;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<PaginatedResponse<MediaRow>>("/api/admin/media?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load media posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Media"
        description="Manage videos, podcasts, and teachings."
        breadcrumbs={[{ label: "Media" }]}
        actions={
          <AdminLinkButton href="/admin/media?new=1">
            <Plus className="h-4 w-4" />
            Add media post
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
            header: "Title",
            render: (row) => <span className="font-medium">{row.title}</span>,
          },
          {
            key: "type",
            header: "Type",
            render: (row) => (
              <AdminBadge tone="accent">{row.type}</AdminBadge>
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
            key: "published",
            header: "Published",
            render: (row) =>
              row.publishedAt ? format(new Date(row.publishedAt), "MMM d, yyyy") : "—",
          },
        ]}
      />
    </>
  );
}
