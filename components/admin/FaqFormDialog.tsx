"use client";

import {
  AdminButton,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminHeader";
import { adminFetch } from "@/lib/admin/api";
import { slugify } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type FaqFormValues = {
  _id?: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: "draft" | "published";
};

type FaqFormDialogProps = {
  open: boolean;
  initial: FaqFormValues | null;
  categorySuggestions: string[];
  onClose: () => void;
  onSaved: () => void;
};

const emptyForm: FaqFormValues = {
  slug: "",
  question: "",
  answer: "",
  category: "General",
  displayOrder: 0,
  status: "published",
};

export function FaqFormDialog({
  open,
  initial,
  categorySuggestions,
  onClose,
  onSaved,
}: FaqFormDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FaqFormValues>(emptyForm);
  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? { ...initial } : { ...emptyForm });
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const set = <K extends keyof FaqFormValues>(key: K, value: FaqFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    const question = form.question.trim();
    const answer = form.answer.trim();
    if (!question || !answer) {
      toast.error("Question and answer are required.");
      return;
    }

    const slug = (form.slug.trim() || slugify(question)).slice(0, 120);
    if (!slug) {
      toast.error("Could not generate a URL slug — check the question.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        slug,
        question,
        answer,
        category: form.category.trim() || "General",
        displayOrder: form.displayOrder,
        status: form.status,
      };

      if (isEdit && initial?._id) {
        await adminFetch(`/api/admin/faqs/${initial._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("FAQ updated");
      } else {
        await adminFetch("/api/admin/faqs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("FAQ added");
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-form-title"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white shadow-xl"
      >
        <div className="border-b border-[var(--admin-border)] px-6 py-4">
          <h2 id="faq-form-title" className="text-lg font-semibold text-[var(--admin-text)]">
            {isEdit ? "Edit FAQ" : "Add FAQ"}
          </h2>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            {isEdit ? "Update the question, answer, or where it appears." : "Create a new question for the FAQs page."}
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <AdminField label="Question" required>
            <AdminInput
              value={form.question}
              onChange={(event) => {
                const question = event.target.value;
                setForm((current) => ({
                  ...current,
                  question,
                  slug: isEdit ? current.slug : slugify(question),
                }));
              }}
              placeholder="How should I prepare for a session?"
            />
          </AdminField>

          <AdminField label="Answer" required>
            <AdminTextarea
              value={form.answer}
              onChange={(event) => set("answer", event.target.value)}
              rows={6}
              placeholder="Write the full answer visitors will read."
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Category" hint="e.g. Sessions, Booking">
              <AdminInput
                value={form.category}
                onChange={(event) => set("category", event.target.value)}
                list="faq-category-suggestions"
              />
              <datalist id="faq-category-suggestions">
                {categorySuggestions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </AdminField>

            <AdminField label="Display order">
              <AdminInput
                type="number"
                value={form.displayOrder}
                onChange={(event) =>
                  set("displayOrder", Number.parseInt(event.target.value, 10) || 0)
                }
              />
            </AdminField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Status">
              <AdminSelect
                value={form.status}
                onChange={(event) => set("status", event.target.value as FaqFormValues["status"])}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </AdminSelect>
            </AdminField>

            <AdminField label="URL slug" hint="Auto-generated from question">
              <AdminInput
                value={form.slug}
                onChange={(event) => set("slug", slugify(event.target.value))}
              />
            </AdminField>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[var(--admin-border)] px-6 py-4">
          <AdminButton variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </AdminButton>
          <AdminButton onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add FAQ"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
