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
import { adminFetch } from "@/lib/admin/api";
import { slugify } from "@/lib/utils";
import { imageMediaSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  duration: z.string().min(1),
  pricePreview: z.string(),
  status: z.enum(["active", "coming_soon", "archived"]),
  bookable: z.boolean(),
  featured: z.boolean(),
  mainImage: imageMediaSchema,
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function NewServicePage() {
  const router = useRouter();
  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      duration: "60 minutes",
      pricePreview: "",
      status: "active",
      bookable: true,
      featured: false,
      mainImage: { url: "/images/seed/session-atmosphere.svg", alt: "Service image" },
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await adminFetch<{ _id: string }>("/api/admin/services", {
        method: "POST",
        body: JSON.stringify(values),
      });
      toast.success("Service created");
      router.push(`/admin/services/${created._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create service");
    }
  });

  return (
    <>
      <AdminHeader
        title="New service"
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: "New" },
        ]}
      />

      <form onSubmit={onSubmit}>
        <AdminCard title="Overview">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title" error={form.formState.errors.title?.message}>
              <AdminInput
                {...form.register("title")}
                onBlur={(event) => {
                  form.register("title").onBlur(event);
                  if (!form.getValues("slug")) {
                    form.setValue("slug", slugify(event.target.value));
                  }
                }}
              />
            </AdminField>
            <AdminField label="Slug" error={form.formState.errors.slug?.message}>
              <AdminInput {...form.register("slug")} />
            </AdminField>
            <div className="md:col-span-2">
              <AdminField label="Short description">
                <AdminTextarea {...form.register("shortDescription")} />
              </AdminField>
            </div>
            <AdminField label="Duration">
              <AdminInput {...form.register("duration")} />
            </AdminField>
            <AdminField label="Price preview">
              <AdminInput {...form.register("pricePreview")} placeholder="From $150" />
            </AdminField>
            <AdminField label="Status">
              <AdminSelect {...form.register("status")}>
                <option value="active">Active</option>
                <option value="coming_soon">Coming soon</option>
                <option value="archived">Archived</option>
              </AdminSelect>
            </AdminField>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("bookable")} />
                Bookable online
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featured")} />
                Featured on site
              </label>
            </div>
            <div className="md:col-span-2">
              <Controller
                control={form.control}
                name="mainImage"
                render={({ field }) => (
                  <ImageUploader value={field.value} onChange={field.onChange} label="Card image" />
                )}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <AdminButton type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create service"
              )}
            </AdminButton>
          </div>
        </AdminCard>
      </form>
    </>
  );
}
