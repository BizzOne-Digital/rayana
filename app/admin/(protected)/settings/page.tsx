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
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SeoFields } from "@/components/admin/SeoFields";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import { seoSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  seo: seoSchema.extend({
    defaultTitle: z.string().optional(),
    defaultDescription: z.string().optional(),
    defaultOgImage: z.any().optional(),
  }),
  booking: z.object({
    hostTimeZone: z.string(),
    rescheduleNoticeHours: z.number(),
    holdDurationMinutes: z.number(),
    eTransferInstructions: z.string(),
  }),
  payments: z.object({
    defaultCurrency: z.string(),
    stripeEnabled: z.boolean(),
    eTransferEnabled: z.boolean(),
  }),
  email: z.object({
    fromName: z.string(),
    replyTo: z.string(),
  }),
  featureFlags: z.object({
    hideShopInNav: z.boolean(),
    hideMediaInNav: z.boolean(),
    shopEnabled: z.boolean(),
    mediaEnabled: z.boolean(),
  }),
  legalNotices: z.object({
    requiresOwnerReview: z.boolean(),
    disclaimerSummary: z.string(),
  }),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("brand");
  const [loading, setLoading] = useState(true);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    adminFetch<SettingsForm>("/api/admin/settings")
      .then((data) => form.reset(data))
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
        description="Configure brand, contact, booking, payments, and feature flags."
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
          { id: "seo", label: "SEO" },
          { id: "booking", label: "Booking" },
          { id: "payments", label: "Payments" },
          { id: "email", label: "Email" },
          { id: "features", label: "Feature Flags" },
          { id: "legal", label: "Legal" },
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

        {tab === "seo" && (
          <AdminCard title="Default SEO">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Default title">
                <AdminInput {...form.register("seo.defaultTitle")} />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="Default description">
                  <AdminTextarea {...form.register("seo.defaultDescription")} />
                </AdminField>
              </div>
              <div className="md:col-span-2">
                <Controller
                  control={form.control}
                  name="seo.defaultOgImage"
                  render={({ field }) => (
                    <ImageUploader
                      label="Default OG image"
                      value={field.value ?? null}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </AdminCard>
        )}

        {tab === "booking" && (
          <AdminCard title="Booking">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Host timezone">
                <AdminInput {...form.register("booking.hostTimeZone")} />
              </AdminField>
              <AdminField label="Hold duration (minutes)">
                <AdminInput type="number" {...form.register("booking.holdDurationMinutes", { valueAsNumber: true })} />
              </AdminField>
              <AdminField label="Reschedule notice (hours)">
                <AdminInput type="number" {...form.register("booking.rescheduleNoticeHours", { valueAsNumber: true })} />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="E-transfer instructions">
                  <AdminTextarea {...form.register("booking.eTransferInstructions")} />
                </AdminField>
              </div>
            </div>
          </AdminCard>
        )}

        {tab === "payments" && (
          <AdminCard title="Payments">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Default currency">
                <AdminInput {...form.register("payments.defaultCurrency")} />
              </AdminField>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("payments.stripeEnabled")} />
                Stripe enabled
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("payments.eTransferEnabled")} />
                E-transfer enabled
              </label>
            </div>
          </AdminCard>
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

        {tab === "features" && (
          <AdminCard title="Feature flags">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featureFlags.shopEnabled")} />
                Shop enabled
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featureFlags.mediaEnabled")} />
                Media enabled
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featureFlags.hideShopInNav")} />
                Hide shop in navigation
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featureFlags.hideMediaInNav")} />
                Hide media in navigation
              </label>
            </div>
          </AdminCard>
        )}

        {tab === "legal" && (
          <AdminCard title="Legal notices">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("legalNotices.requiresOwnerReview")} />
                Legal pages require owner review before publish
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
