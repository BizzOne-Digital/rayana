"use client";

import {
  AdminBadge,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type GalleryCategoryRow = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  displayOrder: number;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<PaginatedResponse<GalleryCategoryRow>>("/api/admin/gallery/categories?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load gallery"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Gallery"
        description="Organize visual collections by category."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <DataTable
        isLoading={loading}
        data={items}
        keyExtractor={(row) => row._id}
        columns={[
          {
            key: "title",
            header: "Category",
            render: (row) => (
              <Link
                href={`/admin/gallery/${row._id}`}
                className="inline-flex items-center gap-2 font-medium text-[var(--admin-accent)] hover:underline"
              >
                <ImageIcon className="h-4 w-4" />
                {row.title}
              </Link>
            ),
          },
          {
            key: "slug",
            header: "Slug",
            render: (row) => row.slug,
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
            key: "order",
            header: "Order",
            render: (row) => row.displayOrder,
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <AdminLinkButton href={`/admin/gallery/${row._id}`} size="sm" variant="secondary">
                Manage images
              </AdminLinkButton>
            ),
          },
        ]}
      />
    </>
  );
}
