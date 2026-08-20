import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Admin | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="admin-theme min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
      {children}
    </div>
  );
}
