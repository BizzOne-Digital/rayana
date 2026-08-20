"use client";

import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
  AdminSelect,
  AdminTabs,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SeoFields } from "@/components/admin/SeoFields";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import { imageMediaSchema, seoSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const serviceFormSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  duration: z.string(),
  pricePreview: z.string(),
  status: z.enum(["active", "coming_soon", "archived"]),
  bookable: z.boolean(),
  featured: z.boolean(),
  standardPrice: z.number().optional(),
  mainImage: imageMediaSchema,
  detailPage: z.object({
    hero: z.object({
      heading: z.string(),
      subheading: z.string(),
      promise: z.string(),
      chips: z.array(z.string()),
      image: imageMediaSchema.optional(),
    }),
    introduction: z.string(),
    audience: z.string(),
    expectations: z.string(),
    process: z.string(),
    practicalDetails: z.string(),
    bookingCta: z.object({
      heading: z.string(),
      body: z.string(),
      buttonLabel: z.string(),
    }),
    seo: seoSchema,
  }),
});

type ServiceForm = z.infer<typeof serviceFormSchema>;

export default function EditServicePage() {
  const params = useParams<{ serviceId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceFormSchema),
  });

  useEffect(() => {
    adminFetch<ServiceForm & { _id: string }>(`/api/admin/services/${params.serviceId}`)
      .then((data) => form.reset(data))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load service"))
      .finally(() => setLoading(false));
  }, [params.serviceId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await adminFetch(`/api/admin/services/${params.serviceId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Service saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  });

  if (loading) return <FormSkeleton />;

  return (
    <>
      <AdminHeader
        title={form.watch("title") || "Edit service"}
        breadcrumbs={[
          { label: "Services", href: "/admin/services" },
          { label: form.watch("title") || "Edit" },
        ]}
        actions={
          <AdminButton onClick={onSubmit} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save changes
          </AdminButton>
        }
      />

      <AdminTabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Overview (card)" },
          { id: "detail", label: "Detail page" },
        ]}
      />

      <form onSubmit={onSubmit} className="space-y-6">
        {activeTab === "overview" && (
          <AdminCard title="Service card">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Title">
                <AdminInput {...form.register("title")} />
              </AdminField>
              <AdminField label="Slug">
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
                <AdminInput {...form.register("pricePreview")} />
              </AdminField>
              <AdminField label="Standard price">
                <AdminInput type="number" step="0.01" {...form.register("standardPrice", { valueAsNumber: true })} />
              </AdminField>
              <AdminField label="Status">
                <AdminSelect {...form.register("status")}>
                  <option value="active">Active</option>
                  <option value="coming_soon">Coming soon</option>
                  <option value="archived">Archived</option>
                </AdminSelect>
              </AdminField>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("bookable")} />
                Bookable
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featured")} />
                Featured
              </label>
              <div className="md:col-span-2">
                <Controller
                  control={form.control}
                  name="mainImage"
                  render={({ field }) => (
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </AdminCard>
        )}

        {activeTab === "detail" && (
          <>
            <AdminCard title="Hero">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Heading">
                  <AdminInput {...form.register("detailPage.hero.heading")} />
                </AdminField>
                <AdminField label="Subheading">
                  <AdminInput {...form.register("detailPage.hero.subheading")} />
                </AdminField>
                <div className="md:col-span-2">
                  <AdminField label="Promise">
                    <AdminTextarea {...form.register("detailPage.hero.promise")} />
                  </AdminField>
                </div>
                <div className="md:col-span-2">
                  <Controller
                    control={form.control}
                    name="detailPage.hero.image"
                    render={({ field }) => (
                      <ImageUploader value={field.value ?? null} onChange={field.onChange} label="Hero image" />
                    )}
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Content sections">
              <div className="space-y-4">
                {[
                  { name: "introduction", label: "Introduction" },
                  { name: "audience", label: "Who this is for" },
                  { name: "expectations", label: "What to expect" },
                  { name: "process", label: "Process" },
                  { name: "practicalDetails", label: "Practical details" },
                ].map((field) => (
                  <AdminField key={field.name} label={field.label}>
                    <Controller
                      control={form.control}
                      name={`detailPage.${field.name}` as "detailPage.introduction"}
                      render={({ field: input }) => (
                        <RichTextEditor value={input.value ?? ""} onChange={input.onChange} />
                      )}
                    />
                  </AdminField>
                ))}
              </div>
            </AdminCard>

            <AdminCard title="Booking CTA">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Heading">
                  <AdminInput {...form.register("detailPage.bookingCta.heading")} />
                </AdminField>
                <AdminField label="Button label">
                  <AdminInput {...form.register("detailPage.bookingCta.buttonLabel")} />
                </AdminField>
                <div className="md:col-span-2">
                  <AdminField label="Body">
                    <AdminTextarea {...form.register("detailPage.bookingCta.body")} />
                  </AdminField>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="SEO">
              <SeoFields control={form.control} prefix="detailPage.seo" />
            </AdminCard>
          </>
        )}
      </form>
    </>
  );
}
