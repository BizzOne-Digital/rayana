"use client";

import {
  AdminBadge,
  AdminButton,
  AdminHeader,
} from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { adminFetch } from "@/lib/admin/api";
import type { AdminBookingRow, PaginatedResponse } from "@/lib/admin/types";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminBookingsPage() {
  const [items, setItems] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    action: "paid" | "override";
  } | null>(null);

  const load = (nextPage = page) => {
    setLoading(true);
    adminFetch<PaginatedResponse<AdminBookingRow>>(`/api/admin/bookings?page=${nextPage}&limit=20`)
      .then((response) => {
        setItems(response.items);
        setTotalPages(response.totalPages);
        setPage(response.page);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyAction = async () => {
    if (!confirmAction) return;
    try {
      await adminFetch(`/api/admin/bookings/${confirmAction.id}`, {
        method: "PATCH",
        body: JSON.stringify(
          confirmAction.action === "paid"
            ? { payment: { status: "paid" } }
            : { status: "confirmed", adminOverride: true },
        ),
      });
      toast.success(
        confirmAction.action === "paid" ? "Marked as paid" : "Booking overridden",
      );
      setConfirmAction(null);
      load(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  return (
    <>
      <AdminHeader
        title="Bookings"
        description="Review sessions, mark payments, and override statuses when needed."
        breadcrumbs={[{ label: "Bookings" }]}
      />

      <DataTable
        isLoading={loading}
        data={items}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        keyExtractor={(row) => row._id}
        columns={[
          {
            key: "reference",
            header: "Reference",
            render: (row) => (
              <div>
                <p className="font-medium">{row.referenceNumber}</p>
                <p className="text-xs text-[var(--admin-muted)]">{row.serviceTitle}</p>
              </div>
            ),
          },
          {
            key: "client",
            header: "Client",
            render: (row) => (
              <div>
                <p>{row.client.name}</p>
                <p className="text-xs text-[var(--admin-muted)]">{row.client.email}</p>
              </div>
            ),
          },
          {
            key: "when",
            header: "When",
            render: (row) => row.startLocal,
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <AdminBadge tone={row.status === "confirmed" ? "success" : "warning"}>
                {row.status.replace("_", " ")}
              </AdminBadge>
            ),
          },
          {
            key: "payment",
            header: "Payment",
            render: (row) => (
              <div>
                <p>{formatCurrency(row.payment.amount, row.payment.currency)}</p>
                <p className="text-xs text-[var(--admin-muted)]">
                  {row.payment.method} · {row.payment.status}
                </p>
              </div>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (row) => (
              <div className="flex justify-end gap-2">
                {row.payment.status !== "paid" && (
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    onClick={() => setConfirmAction({ id: row._id, action: "paid" })}
                  >
                    Mark paid
                  </AdminButton>
                )}
                <AdminButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmAction({ id: row._id, action: "override" })}
                >
                  Override
                </AdminButton>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmAction?.action === "paid" ? "Mark booking as paid?" : "Override booking status?"}
        description={
          confirmAction?.action === "paid"
            ? "This will set the payment status to paid without processing Stripe."
            : "This will confirm the booking regardless of payment state."
        }
        tone={confirmAction?.action === "override" ? "warning" : "danger"}
        confirmLabel={confirmAction?.action === "paid" ? "Mark paid" : "Confirm override"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={applyAction}
      />
    </>
  );
}
