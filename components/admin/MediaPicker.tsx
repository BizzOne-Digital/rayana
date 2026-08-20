"use client";

import { AdminButton } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { adminFetch } from "@/lib/admin/api";
import type { MediaAssetRow, PaginatedResponse } from "@/lib/admin/types";
import type { ImageMedia } from "@/models/shared";
import { cn } from "@/lib/utils";
import { Check, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (media: ImageMedia) => void;
  title?: string;
};

export function MediaPicker({
  open,
  onClose,
  onSelect,
  title = "Choose from library",
}: MediaPickerProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    adminFetch<PaginatedResponse<MediaAssetRow>>(
      `/api/admin/uploads?page=1&limit=24${query ? `&q=${encodeURIComponent(query)}` : ""}`,
    )
      .then((response) => setItems(response.items))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Failed to load media");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [open, query]);

  if (!open) return null;

  const selected = items.find((item) => item._id === selectedId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close media picker"
        onClick={onClose}
      />
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">{title}</h2>
            <p className="text-sm text-[var(--admin-muted)]">
              Select an image from your uploaded media library.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-surface)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[var(--admin-border)] px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by filename or alt text..."
              className="w-full rounded-lg border border-[var(--admin-border)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--admin-accent)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse rounded-lg bg-[var(--admin-surface)]"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No media found"
              description="Upload images from the Uploads page to populate your library."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => {
                const isSelected = selectedId === item._id;
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setSelectedId(item._id)}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border text-left transition-all",
                      isSelected
                        ? "border-[var(--admin-accent)] ring-2 ring-[var(--admin-accent-soft)]"
                        : "border-[var(--admin-border)] hover:border-[var(--admin-accent)]/50",
                    )}
                  >
                    <div className="relative aspect-square bg-[var(--admin-surface)]">
                      <Image
                        src={item.url}
                        alt={item.alt || item.filename}
                        fill
                        className="object-cover"
                        unoptimized={item.url.startsWith("/")}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--admin-accent)]/20">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-accent)] text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-[var(--admin-text)]">
                        {item.filename}
                      </p>
                      <p className="truncate text-[11px] text-[var(--admin-muted)]">
                        {item.alt || "No alt text"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--admin-border)] px-5 py-4">
          <AdminButton variant="secondary" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              onSelect({
                assetId: selected._id,
                url: selected.url,
                alt: selected.alt,
                mimeType: selected.mimeType,
              });
              onClose();
            }}
          >
            Use selected image
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
