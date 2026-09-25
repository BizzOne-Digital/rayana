"use client";

import {
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
  AdminTabs,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch, adminFetchResource } from "@/lib/admin/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const settingsSchema = z.object({
  brand: z.object({
    name: z.string(),
    tagline: z.string(),
    headline: z.string(),
    footerStatement: z.string(),
    logoUrl: z.string().optional(),
  }),
  contact: z.object({
    email: z.string(),
    displayPhone: z.string(),
    e164Phone: z.string(),
    whatsApp: z.string(),
    location: z.string(),
    responseTimeNote: z.string().optional(),
  }),
  social: z.object({
    facebook: z.string(),
    instagram: z.string(),
    youtube: z.string(),
    linktree: z.string(),
  }),
  header: z.object({
    primaryCtaLabel: z.string(),
    primaryCtaHref: z.string(),
    showIntroOnFirstVisit: z.boolean(),
  }),
  footer: z.object({
    newsletterHeading: z.string(),
    newsletterBody: z.string(),
    copyrightName: z.string(),
  }),
  email: z.object({
    fromName: z.string(),
    replyTo: z.string(),
  }),
  legalNotices: z.object({
    requiresOwnerReview: z.boolean(),
    disclaimerSummary: z.string(),
  }),
});

type SettingsForm = z.infer<typeof settingsSchema>;

function pickEditableSettings(data: Record<string, unknown>): SettingsForm {
  const brand = (data.brand ?? {}) as Record<string, string | undefined>;
  const contact = (data.contact ?? {}) as Record<string, string | undefined>;
  const social = (data.social ?? {}) as Record<string, string | undefined>;
  const header = (data.header ?? {}) as Record<string, string | boolean | undefined>;
  const footer = (data.footer ?? {}) as Record<string, string | undefined>;
  const email = (data.email ?? {}) as Record<string, string | undefined>;
  const legalNotices = (data.legalNotices ?? {}) as Record<string, string | boolean | undefined>;

  return {
    brand: {
      name: brand.name ?? "",
      tagline: brand.tagline ?? "",
      headline: brand.headline ?? "",
      footerStatement: brand.footerStatement ?? "",
      logoUrl: brand.logoUrl ?? "",
    },
    contact: {
      email: contact.email ?? "",
      displayPhone: contact.displayPhone ?? "",
      e164Phone: contact.e164Phone ?? "",
      whatsApp: contact.whatsApp ?? "",
      location: contact.location ?? "",
      responseTimeNote: contact.responseTimeNote ?? "",
    },
    social: {
      facebook: social.facebook ?? "",
      instagram: social.instagram ?? "",
      youtube: social.youtube ?? "",
      linktree: social.linktree ?? "",
    },
    header: {
      primaryCtaLabel: String(header.primaryCtaLabel ?? ""),
      primaryCtaHref: String(header.primaryCtaHref ?? ""),
      showIntroOnFirstVisit: Boolean(header.showIntroOnFirstVisit),
    },
    footer: {
      newsletterHeading: footer.newsletterHeading ?? "",
      newsletterBody: footer.newsletterBody ?? "",
      copyrightName: footer.copyrightName ?? "",
    },
    email: {
      fromName: email.fromName ?? "",
      replyTo: email.replyTo ?? "",
    },
    legalNotices: {
      requiresOwnerReview: Boolean(legalNotices.requiresOwnerReview ?? true),
      disclaimerSummary: String(legalNotices.disclaimerSummary ?? ""),
    },
  };
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("brand");
  const [loading, setLoading] = useState(true);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    adminFetchResource<Record<string, unknown>>("/api/admin/settings", "settings")
      .then((data) => form.reset(pickEditableSettings(data)))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, [form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  });

  if (loading) return <FormSkeleton />;

  return (
    <>
      <AdminHeader
        title="Settings"
        description="Configure brand, contact details, header, footer, and disclaimer."
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          <AdminButton onClick={onSubmit} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save settings
          </AdminButton>
        }
      />

      <AdminTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "brand", label: "Brand" },
          { id: "contact", label: "Contact" },
          { id: "social", label: "Social" },
          { id: "header-footer", label: "Header/Footer" },
          { id: "email", label: "Email" },
          { id: "disclaimer", label: "Disclaimer" },
        ]}
      />

      <form onSubmit={onSubmit}>
        {tab === "brand" && (
          <AdminCard title="Brand">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Site name">
                <AdminInput {...form.register("brand.name")} />
              </AdminField>
              <AdminField label="Tagline">
                <AdminInput {...form.register("brand.tagline")} />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="Headline">
                  <AdminInput {...form.register("brand.headline")} />
                </AdminField>
              </div>
              <div className="md:col-span-2">
                <AdminField label="Footer statement">
                  <AdminTextarea {...form.register("brand.footerStatement")} />
                </AdminField>
              </div>
              <AdminField label="Logo URL">
                <AdminInput {...form.register("brand.logoUrl")} />
              </AdminField>
            </div>
          </AdminCard>
        )}

        {tab === "contact" && (
          <AdminCard title="Contact">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Email">
                <AdminInput {...form.register("contact.email")} />
              </AdminField>
              <AdminField label="Display phone">
                <AdminInput {...form.register("contact.displayPhone")} />
              </AdminField>
              <AdminField label="E.164 phone">
                <AdminInput {...form.register("contact.e164Phone")} />
              </AdminField>
              <AdminField label="WhatsApp">
                <AdminInput {...form.register("contact.whatsApp")} />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="Location">
                  <AdminInput {...form.register("contact.location")} />
                </AdminField>
              </div>
              <div className="md:col-span-2">
                <AdminField label="Response time note">
                  <AdminTextarea {...form.register("contact.responseTimeNote")} />
                </AdminField>
              </div>
            </div>
          </AdminCard>
        )}

        {tab === "social" && (
          <AdminCard title="Social links">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Facebook">
                <AdminInput {...form.register("social.facebook")} />
              </AdminField>
              <AdminField label="Instagram">
                <AdminInput {...form.register("social.instagram")} />
              </AdminField>
              <AdminField label="YouTube">
                <AdminInput {...form.register("social.youtube")} />
              </AdminField>
              <AdminField label="Linktree">
                <AdminInput {...form.register("social.linktree")} />
              </AdminField>
            </div>
          </AdminCard>
        )}

        {tab === "header-footer" && (
          <div className="space-y-6">
            <AdminCard title="Header">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Primary CTA label">
                  <AdminInput {...form.register("header.primaryCtaLabel")} />
                </AdminField>
                <AdminField label="Primary CTA href">
                  <AdminInput {...form.register("header.primaryCtaHref")} />
                </AdminField>
                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input type="checkbox" {...form.register("header.showIntroOnFirstVisit")} />
                  Show intro overlay on first visit
                </label>
              </div>
            </AdminCard>
            <AdminCard title="Footer">
              <div className="grid gap-4">
                <AdminField label="Newsletter heading">
                  <AdminInput {...form.register("footer.newsletterHeading")} />
                </AdminField>
                <AdminField label="Newsletter body">
                  <AdminTextarea {...form.register("footer.newsletterBody")} />
                </AdminField>
                <AdminField label="Copyright name">
                  <AdminInput {...form.register("footer.copyrightName")} />
                </AdminField>
              </div>
            </AdminCard>
          </div>
        )}

        {tab === "email" && (
          <AdminCard title="Email">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="From name">
                <AdminInput {...form.register("email.fromName")} />
              </AdminField>
              <AdminField label="Reply-to">
                <AdminInput {...form.register("email.replyTo")} />
              </AdminField>
            </div>
          </AdminCard>
        )}

        {tab === "disclaimer" && (
          <AdminCard title="Disclaimer">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("legalNotices.requiresOwnerReview")} />
                Disclaimer and policy pages require owner review before publish
              </label>
              <AdminField label="Disclaimer summary">
                <AdminTextarea {...form.register("legalNotices.disclaimerSummary")} />
              </AdminField>
            </div>
          </AdminCard>
        )}
      </form>
    </>
  );
}
