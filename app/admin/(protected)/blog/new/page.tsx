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
import { adminFetch } from "@/lib/admin/api";
import { slugify } from "@/lib/utils";
import { imageMediaSchema, seoSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function NewBlogPostPage() {
  const router = useRouter();
  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      author: "Rayana De Silva",
      status: "draft",
      heroImage: { url: "/images/seed/teaching.svg", alt: "Blog hero" },
      seo: {},
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await adminFetch<{ _id: string }>("/api/admin/blog", {
        method: "POST",
        body: JSON.stringify(values),
      });
      toast.success("Blog post created");
      router.push(`/admin/blog/${created._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    }
  });

  return (
    <>
      <AdminHeader
        title="New blog post"
        breadcrumbs={[
          { label: "Blog", href: "/admin/blog" },
          { label: "New" },
        ]}
      />

      <form onSubmit={onSubmit} className="space-y-6">
        <AdminCard title="Post details">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
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
                  <ImageUploader value={field.value} onChange={field.onChange} label="Hero image" />
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

        <div className="flex justify-end">
          <AdminButton type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create post"
            )}
          </AdminButton>
        </div>
      </form>
    </>
  );
}
