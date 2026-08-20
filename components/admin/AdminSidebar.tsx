"use client";

import { cn } from "@/lib/utils";
import { adminNavItems, adminProfileNav } from "@/lib/admin/navigation";
import { SITE_NAME } from "@/lib/constants";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type AdminSidebarProps = {
  userName?: string;
  userEmail?: string;
};

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center gap-3 border-b border-white/10 px-4 py-5",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-accent)] text-white">
          <Heart className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Admin Portal</p>
            <p className="truncate text-xs text-white/60">{SITE_NAME}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[var(--admin-accent)] text-white shadow-sm"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href={adminProfileNav.href}
          className={cn(
            "mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white",
            isActive(adminProfileNav.href) && "bg-white/10 text-white",
            collapsed && "justify-center px-2",
          )}
        >
          <adminProfileNav.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Profile</span>}
        </Link>

        {!collapsed && (userName || userEmail) && (
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{userName ?? "Admin"}</p>
            {userEmail && (
              <p className="truncate text-xs text-white/60">{userEmail}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="mt-2 hidden w-full items-center justify-center rounded-lg border border-white/10 py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--admin-border)] bg-white text-[var(--admin-text)] shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[var(--admin-sidebar)] transition-transform lg:static lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
