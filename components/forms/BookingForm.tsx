"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { PublicService } from "@/lib/sections/types";
import { cn } from "@/lib/utils";

type BookingFormProps = {
  services: PublicService[];
  className?: string;
};

export function BookingForm({ services, className }: BookingFormProps) {
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      toast.success("Booking flow will connect to availability once configured.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "rounded-[2rem] border border-border bg-surface-elevated p-8 shadow-soft",
        className,
      )}
    >
      <p className="eyebrow mb-4">Schedule</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Service</span>
          <select
            value={serviceSlug}
            onChange={(e) => setServiceSlug(e.target.value)}
            className="rounded-xl border border-border bg-warm-ivory px-4 py-3 outline-none focus:border-heart-wine"
          >
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-medium">Preferred date</span>
          <input
            type="date"
            className="rounded-xl border border-border bg-warm-ivory px-4 py-3 outline-none focus:border-heart-wine"
          />
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          <span className="font-medium">Notes for Rayana (optional)</span>
          <textarea
            rows={4}
            className="rounded-xl border border-border bg-warm-ivory px-4 py-3 outline-none focus:border-heart-wine"
            placeholder="Share anything that would help prepare for your session"
          />
        </label>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary mt-6">
        {loading ? "Checking availability…" : "Continue to Booking"}
      </button>
    </form>
  );
}
