"use client";

import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
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

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(["draft", "published", "scheduled"]),
  heroImage: imageMediaSchema,
  seo: seoSchema,
});

type BlogForm = z.infer<typeof blogSchema>;

export default function EditBlogPostPage() {
  const params = useParams<{ postId: string }>();
  const [loading, setLoading] = useState(true);

  const form = useForm<BlogForm>({ resolver: zodResolver(blogSchema) });

  useEffect(() => {
    adminFetch<BlogForm>(`/api/admin/blog/${params.postId}`)
      .then((data) => form.reset(data))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load post"))
      .finally(() => setLoading(false));
  }, [params.postId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await adminFetch(`/api/admin/blog/${params.postId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Post saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  });

  if (loading) return <FormSkeleton />;

  return (
    <>
      <AdminHeader
        title={form.watch("title") || "Edit post"}
        breadcrumbs={[
          { label: "Blog", href: "/admin/blog" },
          { label: form.watch("title") || "Edit" },
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
        <AdminCard title="Post details">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
              <AdminInput {...form.register("title")} />
            </AdminField>
            <AdminField label="Slug">
              <AdminInput {...form.register("slug")} />
            </AdminField>
            <AdminField label="Author">
              <AdminInput {...form.register("author")} />
            </AdminField>
            <AdminField label="Status">
              <select {...form.register("status")} className="w-full rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </AdminField>
            <div className="md:col-span-2">
              <AdminField label="Excerpt">
                <AdminTextarea {...form.register("excerpt")} />
              </AdminField>
            </div>
            <div className="md:col-span-2">
              <Controller
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <ImageUploader value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Body">
          <Controller
            control={form.control}
            name="body"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} minHeight="280px" />
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
