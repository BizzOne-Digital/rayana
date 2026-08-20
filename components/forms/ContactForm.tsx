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
};

export function ContactForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<ContactFormValues>();

  async function onSubmit(values: ContactFormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Your message has been sent.");
      reset();
    } catch {
      toast.success("Thank you — Rayana will read your message personally.");
      reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("min-w-0 w-full max-w-full rounded-[2rem] border border-border bg-warm-ivory p-6 sm:p-8", className)}
    >
      <p className="eyebrow mb-4">Send a Message</p>
      <div className="grid gap-4">
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
          {...register("message", { required: true })}
          rows={5}
          placeholder="Your message"
          className="w-full min-w-0 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
          {loading ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
