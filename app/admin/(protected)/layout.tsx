import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSessionProvider } from "@/components/admin/AdminSessionProvider";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen">
        <AdminSidebar
          userName={session.user.name ?? undefined}
          userEmail={session.user.email ?? undefined}
        />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
        <Toaster richColors position="top-right" closeButton />
      </div>
    </AdminSessionProvider>
  );
}
