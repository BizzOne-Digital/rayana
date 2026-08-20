"use client";

import { AdminButton } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md rounded-xl border border-[var(--admin-border)] bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              tone === "danger" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700",
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-[var(--admin-text)]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <AdminButton variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Working..." : confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
