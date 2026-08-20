"use client";

import {
  AdminBadge,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ProductRow = {
  _id: string;
  name: string;
  slug: string;
  productType: string;
  price: number;
  currency: string;
  visibility: string;
  featured: boolean;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<PaginatedResponse<ProductRow>>("/api/admin/products?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminHeader
        title="Products"
        description="Manage shop offerings when the store feature is enabled."
        breadcrumbs={[{ label: "Products" }]}
        actions={
          <AdminLinkButton href="/admin/products/new">
            <Plus className="h-4 w-4" />
            New product
          </AdminLinkButton>
        }
      />

      <DataTable
        isLoading={loading}
        data={items}
        keyExtractor={(row) => row._id}
        columns={[
          {
            key: "name",
            header: "Product",
            render: (row) => (
              <Link
                href={`/admin/products/${row._id}`}
                className="font-medium text-[var(--admin-accent)] hover:underline"
              >
                {row.name}
              </Link>
            ),
          },
          {
            key: "type",
            header: "Type",
            render: (row) => row.productType,
          },
          {
            key: "price",
            header: "Price",
            render: (row) => formatCurrency(row.price, row.currency),
          },
          {
            key: "visibility",
            header: "Visibility",
            render: (row) => (
              <AdminBadge tone={row.visibility === "published" ? "success" : "warning"}>
                {row.visibility}
              </AdminBadge>
            ),
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
              <AdminLinkButton href={`/admin/products/${row._id}`} size="sm" variant="secondary">
                Edit
              </AdminLinkButton>
            ),
          },
        ]}
      />
    </>
  );
}
