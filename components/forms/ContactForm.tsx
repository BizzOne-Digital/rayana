"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
};

export function ContactForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<ContactFormValues>({
    defaultValues: { honeypot: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim() || undefined,
          message: values.message.trim(),
          honeypot: values.honeypot,
        }),
      });

      const payload = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        const detail =
          payload?.error ??
          (res.status === 422
            ? "Please check your message is at least 10 characters."
            : "Could not send your message. Please try again.");
        throw new Error(detail);
      }

      toast.success("Your message has been sent.");
      reset({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "min-w-0 w-full max-w-full rounded-[2rem] border border-border bg-warm-ivory p-6 sm:p-8",
        className,
      )}
    >
      <p className="eyebrow mb-4">Send a Message</p>
      <div className="grid gap-4">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
          {...register("honeypot")}
        />
        <input
          {...register("name", { required: true })}
          placeholder="Your name"
          className="w-full min-w-0 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email address"
          className="w-full min-w-0 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <input
          {...register("subject")}
          placeholder="Subject (optional)"
          className="w-full min-w-0 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <textarea
          {...register("message", { required: true, minLength: 10 })}
          rows={5}
          minLength={10}
          placeholder="Your message (at least 10 characters)"
          className="w-full min-w-0 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
          {loading ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
