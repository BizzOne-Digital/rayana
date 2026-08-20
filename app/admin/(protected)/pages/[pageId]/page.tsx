"use client";

import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
  AdminTabs,
} from "@/components/admin/AdminHeader";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { SeoFields } from "@/components/admin/SeoFields";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import type { AdminPageDetail } from "@/lib/admin/types";
import { seoSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Eye, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const pageFormSchema = z.object({
  title: z.string().min(1),
  navigationLabel: z.string().min(1),
  showInNavigation: z.boolean(),
  seo: seoSchema,
});

type PageFormValues = z.infer<typeof pageFormSchema>;

export default function AdminPageEditorPage() {
  const params = useParams<{ pageId: string }>();
  const [page, setPage] = useState<AdminPageDetail | null>(null);
  const [sections, setSections] = useState<AdminPageDetail["sections"]>([]);
  const [activeTab, setActiveTab] = useState("sections");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      navigationLabel: "",
      showInNavigation: true,
      seo: {},
    },
  });

  useEffect(() => {
    adminFetch<AdminPageDetail>(`/api/admin/pages/${params.pageId}`)
      .then((data) => {
        setPage(data);
        setSections(data.sections);
        form.reset({
          title: data.title,
          navigationLabel: data.navigationLabel,
          showInNavigation: data.showInNavigation,
          seo: data.seo ?? {},
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load page"))
      .finally(() => setLoading(false));
  }, [params.pageId, form]);

  const save = async (status: "draft" | "published") => {
    if (!page) return;
    setSaving(true);
    try {
      const values = form.getValues();
      const updated = await adminFetch<AdminPageDetail>(`/api/admin/pages/${params.pageId}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...values,
          sections,
          status,
        }),
      });
      setPage(updated);
      toast.success(status === "published" ? "Page published" : "Draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FormSkeleton />;

  if (!page) {
    return (
      <AdminCard>
        <p className="text-sm text-[var(--admin-muted)]">Page not found.</p>
      </AdminCard>
    );
  }

  return (
    <>
      <AdminHeader
        title={page.title}
        description={`Editing ${page.systemKey} · revision ${page.revision}`}
        breadcrumbs={[
          { label: "Pages", href: "/admin/pages" },
          { label: page.title },
        ]}
        actions={
          <>
            <Link
              href={page.route}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-white px-4 py-2 text-sm hover:bg-[var(--admin-surface)]"
            >
              <Eye className="h-4 w-4" />
              Preview
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <AdminButton variant="secondary" disabled={saving} onClick={() => save("draft")}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save draft
            </AdminButton>
            <AdminButton disabled={saving} onClick={() => save("published")}>
              Publish
            </AdminButton>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <AdminBadge tone={page.status === "published" ? "success" : "warning"}>
          {page.status}
        </AdminBadge>
        <span className="text-sm text-[var(--admin-muted)]">{page.route}</span>
      </div>

      <AdminTabs
        active={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: "sections", label: "Sections" },
          { id: "settings", label: "Page settings" },
          { id: "seo", label: "SEO" },
        ]}
      />

      {activeTab === "sections" && (
        <AdminCard>
          <SectionEditor sections={sections} onChange={setSections} />
        </AdminCard>
      )}

      {activeTab === "settings" && (
        <AdminCard title="Page settings">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Title">
              <AdminInput {...form.register("title")} />
            </AdminField>
            <AdminField label="Navigation label">
              <AdminInput {...form.register("navigationLabel")} />
            </AdminField>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" {...form.register("showInNavigation")} />
              Show in site navigation
            </label>
          </div>
        </AdminCard>
      )}

      {activeTab === "seo" && (
        <AdminCard title="Search & social">
          <SeoFields control={form.control} />
        </AdminCard>
      )}
    </>
  );
}
