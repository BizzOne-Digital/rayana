import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-[var(--admin-muted)]">Loading...</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
