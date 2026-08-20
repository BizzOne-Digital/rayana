"use client";

import {
  AdminButton,
  AdminCard,
  AdminHeader,
} from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { adminFetch } from "@/lib/admin/api";
import type { MediaAssetRow, PaginatedResponse } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Grid3X3, List, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminUploadsPage() {
  const [items, setItems] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = (nextPage = page) => {
    setLoading(true);
    adminFetch<PaginatedResponse<MediaAssetRow>>(`/api/admin/uploads?page=${nextPage}&limit=24`)
      .then((response) => {
        setItems(response.items);
        setPage(response.page);
        setTotalPages(response.totalPages);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load uploads"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const remove = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/uploads/${deleteId}`, { method: "DELETE" });
      toast.success("Asset deleted");
      setDeleteId(null);
      load(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <AdminHeader
        title="Uploads"
        description="Media library for images used across the site."
        breadcrumbs={[{ label: "Uploads" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "rounded-lg border px-3 py-2",
                view === "grid" && "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]",
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "rounded-lg border px-3 py-2",
                view === "list" && "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]",
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <AdminCard title="Upload new asset">
          <ImageUploader
            value={null}
            onChange={() => load(page)}
            label="Upload image"
            hint="Images are optimized and stored in your local uploads directory."
          />
        </AdminCard>

        <AdminCard title="Library">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-lg bg-[var(--admin-surface)]" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Upload}
              title="No uploads yet"
              description="Upload your first image to start building the media library."
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group overflow-hidden rounded-lg border border-[var(--admin-border)]"
                >
                  <div className="relative aspect-square bg-[var(--admin-surface)]">
                    <Image
                      src={item.url}
                      alt={item.alt || item.filename}
                      fill
                      className="object-cover"
                      unoptimized={item.url.startsWith("/")}
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteId(item._id)}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Delete asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{item.filename}</p>
                    <p className="truncate text-[11px] text-[var(--admin-muted)]">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg border border-[var(--admin-border)] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-[var(--admin-surface)]">
                      <Image
                        src={item.url}
                        alt={item.alt || item.filename}
                        fill
                        className="object-cover"
                        unoptimized={item.url.startsWith("/")}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.filename}</p>
                      <p className="text-xs text-[var(--admin-muted)]">
                        {item.mimeType} · {Math.round(item.bytes / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <AdminButton variant="ghost" size="sm" onClick={() => setDeleteId(item._id)}>
                    Delete
                  </AdminButton>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[var(--admin-muted)]">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <AdminButton
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </AdminButton>
              </div>
            </div>
          )}
        </AdminCard>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete uploaded asset"
        description="This file will be removed from the media library."
        onCancel={() => setDeleteId(null)}
        onConfirm={remove}
      />
    </>
  );
}
