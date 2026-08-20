"use client";

import {
  AdminBadge,
  AdminButton,
  AdminHeader,
  AdminTabs,
} from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type TestimonialRow = {
  _id: string;
  name: string;
  excerpt: string;
  status: "pending" | "approved" | "rejected" | "archived";
  submittedAt?: string;
  featured: boolean;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  const load = () => {
    setLoading(true);
    adminFetch<PaginatedResponse<TestimonialRow>>("/api/admin/testimonials?limit=100")
      .then((response) => setItems(response.items))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load testimonials"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((item) => item.status === tab);
  }, [items, tab]);

  const pendingCount = items.filter((item) => item.status === "pending").length;

  const updateStatus = async (id: string, status: TestimonialRow["status"]) => {
    try {
      await adminFetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(status === "approved" ? "Testimonial approved" : "Testimonial updated");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <>
      <AdminHeader
        title="Testimonials"
        description="Review and approve submitted testimonials before publishing."
        breadcrumbs={[{ label: "Testimonials" }]}
      />

      <AdminTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "pending", label: "Pending queue", count: pendingCount },
          { id: "approved", label: "Approved" },
          { id: "rejected", label: "Rejected" },
          { id: "all", label: "All" },
        ]}
      />

      <DataTable
        isLoading={loading}
        data={filtered}
        keyExtractor={(row) => row._id}
        emptyMessage={
          tab === "pending"
            ? "No testimonials awaiting approval."
            : "No testimonials in this view."
        }
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-[var(--admin-muted)] line-clamp-2">{row.excerpt}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <AdminBadge
                tone={
                  row.status === "approved"
                    ? "success"
                    : row.status === "pending"
                      ? "warning"
                      : "neutral"
                }
              >
                {row.status}
              </AdminBadge>
            ),
          },
          {
            key: "submitted",
            header: "Submitted",
            render: (row) =>
              row.submittedAt ? format(new Date(row.submittedAt), "MMM d, yyyy") : "—",
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) =>
              row.status === "pending" ? (
                <div className="flex justify-end gap-2">
                  <AdminButton size="sm" onClick={() => updateStatus(row._id, "approved")}>
                    <Check className="h-4 w-4" />
                    Approve
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(row._id, "rejected")}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </AdminButton>
                </div>
              ) : (
                <AdminBadge tone={row.featured ? "accent" : "neutral"}>
                  {row.featured ? "Featured" : "Standard"}
                </AdminBadge>
              ),
          },
        ]}
      />
    </>
  );
}
