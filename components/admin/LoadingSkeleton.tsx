export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-lg bg-[var(--admin-surface)]"
        />
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl border border-[var(--admin-border)] bg-white"
        />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--admin-surface)]" />
          <div className="h-10 animate-pulse rounded-lg bg-[var(--admin-surface)]" />
        </div>
      ))}
    </div>
  );
}

export function LoadingSkeleton({
  variant = "table",
}: {
  variant?: "table" | "cards" | "form";
}) {
  if (variant === "cards") return <CardGridSkeleton />;
  if (variant === "form") return <FormSkeleton />;
  return <TableSkeleton />;
}
