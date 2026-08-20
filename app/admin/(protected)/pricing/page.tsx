"use client";

import {
  AdminBadge,
  AdminButton,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PricingRow = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  availability: string;
  featured: boolean;
};

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminFetch<PaginatedResponse<PricingRow>>("/api/admin/pricing?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load pricing"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/pricing/${deleteId}`, { method: "DELETE" });
      toast.success("Pricing plan deleted");
      setDeleteId(null);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <AdminHeader
        title="Pricing"
        description="Manage pricing plans and promotional offers."
        breadcrumbs={[{ label: "Pricing" }]}
        actions={
          <AdminLinkButton href="/admin/pricing?new=1">
            <Plus className="h-4 w-4" />
            Add plan
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
            header: "Plan",
            render: (row) => <span className="font-medium">{row.title}</span>,
          },
          {
            key: "price",
            header: "Price",
            render: (row) => formatCurrency(row.price, row.currency),
          },
          {
            key: "availability",
            header: "Status",
            render: (row) => (
              <AdminBadge tone={row.availability === "active" ? "success" : "warning"}>
                {row.availability.replace("_", " ")}
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
              <AdminButton variant="ghost" size="sm" onClick={() => setDeleteId(row._id)}>
                Delete
              </AdminButton>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete pricing plan"
        description="This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={remove}
      />
    </>
  );
}
