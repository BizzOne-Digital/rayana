"use client";

import {
  AdminBadge,
  AdminButton,
  AdminHeader,
} from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FaqRow = {
  _id: string;
  question: string;
  category: string;
  status: string;
  displayOrder: number;
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminFetch<PaginatedResponse<FaqRow>>("/api/admin/faqs?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load FAQs"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/faqs/${deleteId}`, { method: "DELETE" });
      toast.success("FAQ deleted");
      setDeleteId(null);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <AdminHeader
        title="FAQs"
        description="Manage frequently asked questions by category."
        breadcrumbs={[{ label: "FAQs" }]}
        actions={
          <AdminButton onClick={() => toast.message("Use the API or seed script to add FAQs for now.")}>
            <Plus className="h-4 w-4" />
            Add FAQ
          </AdminButton>
        }
      />

      <DataTable
        isLoading={loading}
        data={items}
        keyExtractor={(row) => row._id}
        columns={[
          {
            key: "question",
            header: "Question",
            render: (row) => <span className="font-medium">{row.question}</span>,
          },
          {
            key: "category",
            header: "Category",
            render: (row) => row.category,
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
              <AdminButton variant="ghost" size="sm" onClick={() => setDeleteId(row._id)}>
                Delete
              </AdminButton>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete FAQ"
        description="This question will be removed from the site."
        onCancel={() => setDeleteId(null)}
        onConfirm={remove}
      />
    </>
  );
}
