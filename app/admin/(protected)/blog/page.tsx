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
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BlogRow = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt?: string;
  updatedAt: string;
};

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<PaginatedResponse<BlogRow>>("/api/admin/blog?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load blog posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Blog"
        description="Publish reflections, teachings, and announcements."
        breadcrumbs={[{ label: "Blog" }]}
        actions={
          <AdminLinkButton href="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New post
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
            header: "Post",
            render: (row) => (
              <Link href={`/admin/blog/${row._id}`} className="font-medium text-[var(--admin-accent)] hover:underline">
                {row.title}
              </Link>
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
              <AdminLinkButton href={`/admin/blog/${row._id}`} size="sm" variant="secondary">
                Edit
              </AdminLinkButton>
            ),
          },
        ]}
      />
    </>
  );
}
