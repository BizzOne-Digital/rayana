"use client";

import {
  AdminBadge,
  AdminButton,
  AdminHeader,
} from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { FaqFormDialog, type FaqFormValues } from "@/components/admin/FaqFormDialog";
import { adminFetch, adminFetchList } from "@/lib/admin/api";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FaqRow = {
  _id: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  displayOrder: number;
};

export default function AdminFaqsPage() {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FaqFormValues | null>(null);

  const load = () => {
    setLoading(true);
    adminFetchList<FaqRow>("/api/admin/faqs?limit=100")
      .then((rows) => setItems(rows))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load FAQs"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categorySuggestions = useMemo(() => {
    const fromItems = items.map((item) => item.category).filter(Boolean);
    return Array.from(new Set(["General", "Sessions", "Booking", ...fromItems])).sort();
  }, [items]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (row: FaqRow) => {
    setEditing({
      _id: row._id,
      slug: row.slug,
      question: row.question,
      answer: row.answer,
      category: row.category || "General",
      displayOrder: row.displayOrder ?? 0,
      status: row.status === "draft" ? "draft" : "published",
    });
    setFormOpen(true);
  };

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
          <AdminButton onClick={openCreate}>
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
              <div className="flex justify-end gap-1">
                <AdminButton variant="ghost" size="sm" onClick={() => openEdit(row)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => setDeleteId(row._id)}>
                  Delete
                </AdminButton>
              </div>
            ),
          },
        ]}
      />

      <FaqFormDialog
        open={formOpen}
        initial={editing}
        categorySuggestions={categorySuggestions}
        onClose={() => setFormOpen(false)}
        onSaved={load}
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
