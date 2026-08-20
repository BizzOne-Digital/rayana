"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ReviewFormValues = {
  name: string;
  email: string;
  quote: string;
  showFullName: boolean;
};

export function ReviewForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<ReviewFormValues>({
    defaultValues: { showFullName: true },
  });

  async function onSubmit(values: ReviewFormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Thank you — your review will be reviewed before publishing.");
      reset();
    } catch {
      toast.success("Thank you for sharing your experience.");
      reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("rounded-[2rem] border border-border bg-warm-ivory p-8", className)}
    >
      <p className="eyebrow mb-4">Your Review</p>
      <div className="grid gap-4">
        <input
          {...register("name", { required: true })}
          placeholder="Your name"
          className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email (not published)"
          className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <textarea
          {...register("quote", { required: true })}
          rows={6}
          placeholder="Share your experience working with Rayana"
          className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none focus:border-heart-wine"
        />
        <label className="flex items-center gap-2 text-sm text-muted-stone">
          <input type="checkbox" {...register("showFullName")} />
          Display my full name publicly
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
