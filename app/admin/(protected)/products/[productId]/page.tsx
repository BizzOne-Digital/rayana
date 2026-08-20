"use client";

import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SeoFields } from "@/components/admin/SeoFields";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import { slugify } from "@/lib/utils";
import { imageMediaSchema, seoSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  productType: z.enum(["physical", "digital", "course", "gift-certificate"]),
  price: z.number().min(0),
  salePrice: z.number().optional(),
  currency: z.string().min(1),
  stockStatus: z.enum(["in_stock", "out_of_stock", "unlimited"]),
  visibility: z.enum(["draft", "published", "hidden"]),
  featured: z.boolean(),
  gallery: z.array(imageMediaSchema),
  seo: seoSchema,
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminProductEditorPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const isNew = params.productId === "new";
  const [loading, setLoading] = useState(!isNew);
  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      summary: "",
      description: "",
      productType: "digital",
      price: 0,
      currency: "CAD",
      stockStatus: "unlimited",
      visibility: "draft",
      featured: false,
      gallery: [],
      seo: {},
    },
  });

  useEffect(() => {
    if (isNew) return;
    adminFetch<ProductForm>(`/api/admin/products/${params.productId}`)
      .then((data) => form.reset(data))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load product"))
      .finally(() => setLoading(false));
  }, [params.productId, isNew, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isNew) {
        const created = await adminFetch<{ _id: string }>("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Product created");
        router.push(`/admin/products/${created._id}`);
        return;
      }
      await adminFetch(`/api/admin/products/${params.productId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Product saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  });

  if (loading) return <FormSkeleton />;

  return (
    <>
      <AdminHeader
        title={isNew ? "New product" : form.watch("name") || "Edit product"}
        breadcrumbs={[
          { label: "Products", href: "/admin/products" },
          { label: isNew ? "New" : form.watch("name") || "Edit" },
        ]}
        actions={
          <AdminButton onClick={onSubmit} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </AdminButton>
        }
      />

      <form onSubmit={onSubmit} className="space-y-6">
        <AdminCard title="Product details">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Name">
              <AdminInput
                {...form.register("name")}
                onBlur={(event) => {
                  form.register("name").onBlur(event);
                  if (isNew && !form.getValues("slug")) {
                    form.setValue("slug", slugify(event.target.value));
                  }
                }}
              />
            </AdminField>
            <AdminField label="Slug">
              <AdminInput {...form.register("slug")} />
            </AdminField>
            <AdminField label="Type">
              <AdminSelect {...form.register("productType")}>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
                <option value="course">Course</option>
                <option value="gift-certificate">Gift certificate</option>
              </AdminSelect>
            </AdminField>
            <AdminField label="Visibility">
              <AdminSelect {...form.register("visibility")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </AdminSelect>
            </AdminField>
            <AdminField label="Price">
              <AdminInput type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
            </AdminField>
            <AdminField label="Sale price">
              <AdminInput type="number" step="0.01" {...form.register("salePrice", { valueAsNumber: true })} />
            </AdminField>
            <AdminField label="Currency">
              <AdminInput {...form.register("currency")} />
            </AdminField>
            <AdminField label="Stock status">
              <AdminSelect {...form.register("stockStatus")}>
                <option value="unlimited">Unlimited</option>
                <option value="in_stock">In stock</option>
                <option value="out_of_stock">Out of stock</option>
              </AdminSelect>
            </AdminField>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" {...form.register("featured")} />
              Featured product
            </label>
            <div className="md:col-span-2">
              <AdminField label="Summary">
                <AdminTextarea {...form.register("summary")} />
              </AdminField>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Description">
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} minHeight="240px" />
            )}
          />
        </AdminCard>

        <AdminCard title="Gallery">
          <Controller
            control={form.control}
            name="gallery.0"
            render={({ field }) => (
              <ImageUploader
                label="Primary product image"
                value={field.value ?? null}
                onChange={(image) => form.setValue("gallery", image ? [image] : [])}
              />
            )}
          />
        </AdminCard>

        <AdminCard title="SEO">
          <SeoFields control={form.control} />
        </AdminCard>
      </form>
    </>
  );
}
