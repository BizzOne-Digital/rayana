"use client";

import {
  AdminButton,
  AdminField,
  AdminInput,
} from "@/components/admin/AdminHeader";
import { adminUploadToFolder, type StoredUploadFolder } from "@/lib/admin/api";
import { deleteStoredUploadByUrl } from "@/lib/storage/stored-upload-client";
import type { ImageMedia } from "@/models/shared";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { AdminImagePreview } from "@/components/admin/AdminImagePreview";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ImageUploaderProps = {
  value?: ImageMedia | null;
  onChange: (value: ImageMedia | null) => void;
  label?: string;
  hint?: string;
  accept?: string;
  folder?: StoredUploadFolder;
};

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  hint,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  folder = "pages",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [alt, setAlt] = useState(value?.alt ?? "");

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      if (value?.url) {
        await deleteStoredUploadByUrl(value.url);
      }
      const uploaded = await adminUploadToFolder(file, folder);
      onChange({
        assetId: uploaded.filename,
        url: uploaded.url,
        alt: alt || file.name,
        mimeType: file.type,
      });
      setPreviewKey((key) => key + 1);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminField label={label} hint={hint}>
      <div className="space-y-3">
        {value?.url ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <div className="relative aspect-[16/10] w-full">
              <AdminImagePreview
                src={`${value.url}${value.url.includes("?") ? "&" : "?"}v=${previewKey}`}
                alt={value.alt || "Uploaded image preview"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                void deleteStoredUploadByUrl(value.url).finally(() => onChange(null));
              }}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)]/50 px-6 py-10 text-center transition-colors hover:border-[var(--admin-accent)] hover:bg-[var(--admin-accent-soft)]/30",
              uploading && "cursor-wait opacity-70",
            )}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-accent)]" />
            ) : (
              <>
                <Upload className="mb-2 h-8 w-8 text-[var(--admin-accent)]" />
                <span className="text-sm font-medium text-[var(--admin-text)]">
                  Click to upload
                </span>
                <span className="mt-1 text-xs text-[var(--admin-muted)]">
                  JPG, PNG, WebP or SVG
                </span>
              </>
            )}
          </button>
        )}

        <AdminInput
          value={alt}
          onChange={(event) => {
            const nextAlt = event.target.value;
            setAlt(nextAlt);
            if (value) onChange({ ...value, alt: nextAlt });
          }}
          placeholder="Alt text for accessibility"
        />

        <div className="flex flex-wrap gap-2">
          <AdminButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <ImageIcon className="h-4 w-4" />
            {value ? "Replace image" : "Choose file"}
          </AdminButton>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />
      </div>
    </AdminField>
  );
}
