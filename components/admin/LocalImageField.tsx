"use client";

import { adminUploadToFolder, type StoredUploadFolder } from "@/lib/admin/api";
import { deleteStoredUploadByUrl } from "@/lib/storage/stored-upload-client";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AdminButton, AdminField } from "@/components/admin/AdminHeader";

type LocalImageFieldProps = {
  value?: string;
  onChange: (url: string) => void;
  folder: StoredUploadFolder;
  label?: string;
  hint?: string;
};

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

export function LocalImageField({
  value = "",
  onChange,
  folder,
  label = "Image",
  hint,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      if (value) {
        await deleteStoredUploadByUrl(value);
      }
      const result = await adminUploadToFolder(file, folder);
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (value) {
      await deleteStoredUploadByUrl(value);
    }
    onChange("");
  };

  return (
    <AdminField label={label} hint={hint}>
      <div className="space-y-3">
        {value ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={value}
                alt=""
                fill
                className="object-cover"
                unoptimized={value.startsWith("/api/uploads/")}
              />
            </div>
            <button
              type="button"
              onClick={() => void remove()}
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
              "flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)]/50 px-6 py-8 text-center transition-colors hover:border-[var(--admin-accent)]",
              uploading && "cursor-wait opacity-70",
            )}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-accent)]" />
            ) : (
              <>
                <Upload className="mb-2 h-7 w-7 text-[var(--admin-accent)]" />
                <span className="text-sm font-medium">Upload image</span>
                <span className="mt-1 text-xs text-[var(--admin-muted)]">PNG, JPEG, WebP, GIF · max 8MB</span>
              </>
            )}
          </button>
        )}

        <div className="flex flex-wrap gap-2">
          <AdminButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <ImageIcon className="h-4 w-4" />
            {value ? "Replace" : "Choose file"}
          </AdminButton>
          {value ? (
            <AdminButton type="button" variant="ghost" size="sm" onClick={() => void remove()}>
              Remove
            </AdminButton>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </div>
    </AdminField>
  );
}
