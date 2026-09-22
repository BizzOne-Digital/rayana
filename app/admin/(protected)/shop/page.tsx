"use client";

import {
  AdminCard,
  AdminHeader,
  AdminLinkButton,
} from "@/components/admin/AdminHeader";
import { adminFetchList } from "@/lib/admin/api";
import {
  partitionPublishedProducts,
  SHOP_FOUNDATION_NOTE,
  SHOP_FOUNDATION_SUBTITLE,
  SHOP_FOUNDATION_TITLE,
  SHOP_OUT_OF_BODY_NOTE,
  SHOP_OUT_OF_BODY_SUBTITLE,
  SHOP_OUT_OF_BODY_TITLE,
  shopProductTier,
} from "@/lib/data/shop-catalog";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ShopProductRow = {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  price: number;
  currency: string;
  displayOrder: number;
  visibility: string;
};

function ModuleList({
  title,
  subtitle,
  note,
  items,
}: {
  title: string;
  subtitle: string;
  note: string;
  items: ShopProductRow[];
}) {
  if (items.length === 0) {
    return (
      <AdminCard title={title} description={subtitle}>
        <p className="text-sm text-[var(--admin-muted)]">
          No shop modules found. Run seed or add products with slugs like chakra-1.
        </p>
      </AdminCard>
    );
  }

  return (
    <AdminCard title={title} description={`${subtitle} · ${note}`}>
      <ul className="divide-y divide-[var(--admin-border)]">
        {items.map((item) => {
          const chakraMatch = /^chakra-(\d+)$/.exec(item.slug);
          return (
            <li
              key={item._id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {chakraMatch ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--admin-accent)]/15 text-sm font-semibold text-[var(--admin-accent)]">
                      {chakraMatch[1]}
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--admin-surface)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--admin-muted)]">
                      Intro
                    </span>
                  )}
                  <p className="font-medium text-[var(--admin-text)]">{item.name}</p>
                  <span className="text-xs text-[var(--admin-muted)]">
                    {item.price === 0
                      ? "Free"
                      : formatCurrency(item.price, item.currency)}
                    {item.visibility !== "published" ? ` · ${item.visibility}` : ""}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--admin-muted)]">
                  {item.summary || "No card tagline yet."}
                </p>
                <Link
                  href={`/shop/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--admin-accent)] hover:underline"
                >
                  View on site
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <AdminLinkButton
                href={`/admin/products/${item._id}?from=shop`}
                variant="secondary"
                className="shrink-0"
              >
                <Pencil className="h-4 w-4" />
                Edit description
              </AdminLinkButton>
            </li>
          );
        })}
      </ul>
    </AdminCard>
  );
}

export default function AdminShopModulesPage() {
  const [products, setProducts] = useState<ShopProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetchList<ShopProductRow>("/api/admin/products?limit=100")
      .then((rows) => {
        const shopOnly = rows.filter((row) => shopProductTier(row.slug) !== null);
        setProducts(shopOnly);
      })
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Failed to load shop modules"),
      )
      .finally(() => setLoading(false));
  }, []);

  const { foundation, outOfBody } = useMemo(
    () => partitionPublishedProducts(products),
    [products],
  );

  return (
    <>
      <AdminHeader
        title="Shop — Chakra modules"
        description="Update summary (shop card) and description (module page) for each chakra."
        breadcrumbs={[{ label: "Shop modules" }]}
        actions={
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--admin-border)] px-4 py-2 text-sm font-medium text-[var(--admin-text)] hover:bg-[var(--admin-surface)]"
          >
            <ExternalLink className="h-4 w-4" />
            View public shop
          </a>
        }
      />

      <div className="mb-6 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)]/60 px-5 py-4 text-sm text-[var(--admin-muted)]">
        Click <strong>Edit description</strong> on any module. Use <strong>Summary</strong> for the
        shop card line and <strong>Description</strong> for the full module page.
      </div>

      {loading ? (
        <p className="text-sm text-[var(--admin-muted)]">Loading modules…</p>
      ) : (
        <div className="space-y-8">
          <ModuleList
            title={SHOP_FOUNDATION_TITLE}
            subtitle={SHOP_FOUNDATION_SUBTITLE}
            note={SHOP_FOUNDATION_NOTE}
            items={foundation}
          />
          <ModuleList
            title={SHOP_OUT_OF_BODY_TITLE}
            subtitle={SHOP_OUT_OF_BODY_SUBTITLE}
            note={SHOP_OUT_OF_BODY_NOTE}
            items={outOfBody}
          />
        </div>
      )}
    </>
  );
}
