"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type ShopPurchaseButtonProps = {
  productSlug: string;
  price: number;
  isFree: boolean;
  productTitle: string;
};

export function ShopPurchaseButton({
  productSlug,
  price,
  isFree,
  productTitle,
}: ShopPurchaseButtonProps) {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/shop-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Checkout could not be started");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (isFree) {
    return (
      <Link href="/contact" className="btn btn-primary inline-flex justify-center">
        Get in touch for access
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => void startCheckout()}
        disabled={loading}
        className="btn btn-primary inline-flex justify-center disabled:opacity-70"
      >
        {loading ? "Redirecting to payment…" : "Purchase"}
      </button>
      <p className="text-sm text-[#4e0505]/70">
        After payment, Rayana will email your module access. Questions?{" "}
        <Link
          href={`/contact?interest=${encodeURIComponent(productTitle)}`}
          className="text-[#7e1638] underline-offset-2 hover:underline"
        >
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
