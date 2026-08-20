"use client";

import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import type { PaginatedResponse } from "@/lib/admin/types";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CategoryDetail = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: "draft" | "published";
  coverImage: { url: string; alt?: string };
};

type GalleryImageRow = {
  _id: string;
  title: string;
  alt: string;
  image: { url: string };
  displayOrder: number;
};

export default function AdminGalleryCategoryPage() {
  const params = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      adminFetch<CategoryDetail>(`/api/admin/gallery/categories/${params.categoryId}`),
      adminFetch<PaginatedResponse<GalleryImageRow>>(
        `/api/admin/gallery/images?categoryId=${params.categoryId}&limit=100`,
      ),
    ])
      .then(([categoryData, imageData]) => {
        setCategory(categoryData);
        setImages(imageData.items);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load gallery"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [params.categoryId]);

  const saveCategory = async () => {
    if (!category) return;
    setSaving(true);
    try {
      const updated = await adminFetch<CategoryDetail>(
        `/api/admin/gallery/categories/${params.categoryId}`,
        {
          method: "PATCH",
          body: JSON.stringify(category),
        },
      );
      setCategory(updated);
      toast.success("Category saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/admin/gallery/images/${deleteId}`, { method: "DELETE" });
      toast.success("Image removed");
      setDeleteId(null);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  if (loading) return <FormSkeleton />;
  if (!category) return <AdminCard>Category not found.</AdminCard>;

  return (
    <>
      <AdminHeader
        title={category.title}
        breadcrumbs={[
          { label: "Gallery", href: "/admin/gallery" },
          { label: category.title },
        ]}
        actions={
          <AdminButton onClick={saveCategory} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save category
          </AdminButton>
        }
      />

      <div className="space-y-6">
        <AdminCard title="Category details">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
              <AdminInput
                value={category.title}
                onChange={(event) => setCategory({ ...category, title: event.target.value })}
              />
            </AdminField>
            <AdminField label="Slug">
              <AdminInput
                value={category.slug}
                onChange={(event) => setCategory({ ...category, slug: event.target.value })}
              />
            </AdminField>
            <div className="md:col-span-2">
              <AdminField label="Description">
                <AdminTextarea
                  value={category.description}
                  onChange={(event) =>
                    setCategory({ ...category, description: event.target.value })
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Status">
              <select
                value={category.status}
                onChange={(event) =>
                  setCategory({
                    ...category,
                    status: event.target.value as CategoryDetail["status"],
                  })
                }
                className="w-full rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </AdminField>
            <div className="md:col-span-2">
              <ImageUploader
                value={category.coverImage}
                onChange={(coverImage) =>
                  setCategory({ ...category, coverImage: coverImage ?? category.coverImage })
                }
                label="Cover image"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Images in this category">
          <DataTable
            data={images}
            keyExtractor={(row) => row._id}
            columns={[
              {
                key: "title",
                header: "Image",
                render: (row) => (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={row.image.url} alt={row.alt} className="h-12 w-12 rounded object-cover" />
                    <div>
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs text-[var(--admin-muted)]">{row.alt}</p>
                    </div>
                  </div>
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
                    <Trash2 className="h-4 w-4" />
                  </AdminButton>
                ),
              },
            ]}
          />
        </AdminCard>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove gallery image"
        description="This image will be removed from the category."
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteImage}
      />
    </>
  );
}
