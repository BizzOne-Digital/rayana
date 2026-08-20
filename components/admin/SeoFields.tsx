"use client";

import {
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { SEOInput } from "@/lib/validation/common";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type SeoFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  prefix?: Path<T>;
  showOgImage?: boolean;
};

export function SeoFields<T extends FieldValues>({
  control,
  prefix = "seo" as Path<T>,
  showOgImage = true,
}: SeoFieldsProps<T>) {
  const field = (name: string) => `${String(prefix)}.${name}` as Path<T>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Controller
        control={control}
        name={field("title")}
        render={({ field: input, fieldState }) => (
          <AdminField label="SEO title" error={fieldState.error?.message}>
            <AdminInput {...input} value={input.value ?? ""} placeholder="Page title for search engines" />
          </AdminField>
        )}
      />
      <Controller
        control={control}
        name={field("canonicalUrl")}
        render={({ field: input, fieldState }) => (
          <AdminField label="Canonical URL" error={fieldState.error?.message}>
            <AdminInput {...input} value={input.value ?? ""} placeholder="https://..." />
          </AdminField>
        )}
      />
      <div className="md:col-span-2">
        <Controller
          control={control}
          name={field("description")}
          render={({ field: input, fieldState }) => (
            <AdminField label="Meta description" error={fieldState.error?.message}>
              <AdminTextarea
                {...input}
                value={input.value ?? ""}
                placeholder="Brief description for search results"
              />
            </AdminField>
          )}
        />
      </div>
      <Controller
        control={control}
        name={field("ogTitle")}
        render={({ field: input, fieldState }) => (
          <AdminField label="Open Graph title" error={fieldState.error?.message}>
            <AdminInput {...input} value={input.value ?? ""} />
          </AdminField>
        )}
      />
      <Controller
        control={control}
        name={field("ogDescription")}
        render={({ field: input, fieldState }) => (
          <AdminField label="Open Graph description" error={fieldState.error?.message}>
            <AdminTextarea {...input} value={input.value ?? ""} rows={3} />
          </AdminField>
        )}
      />
      {showOgImage && (
        <div className="md:col-span-2">
          <Controller
            control={control}
            name={field("ogImage")}
            render={({ field: input }) => (
              <ImageUploader
                label="Open Graph image"
                value={input.value ?? null}
                onChange={input.onChange}
              />
            )}
          />
        </div>
      )}
      <Controller
        control={control}
        name={field("noIndex")}
        render={({ field: input }) => (
          <label className="flex items-center gap-2 text-sm text-[var(--admin-text)] md:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(input.value)}
              onChange={(event) => input.onChange(event.target.checked)}
              className="rounded border-[var(--admin-border)] text-[var(--admin-accent)] focus:ring-[var(--admin-accent-soft)]"
            />
            Hide from search engines (noindex)
          </label>
        )}
      />
    </div>
  );
}

export type SeoFormValues = SEOInput;
