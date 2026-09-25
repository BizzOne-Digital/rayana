import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  ShoppingBag,
  Star,
  User,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  {
    label: "Shop modules",
    href: "/admin/shop",
    icon: ShoppingBag,
    description: "Edit chakra module descriptions for the shop",
  },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Submissions", href: "/admin/submissions", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const adminProfileNav: AdminNavItem = {
  label: "Profile",
  href: "/admin/profile",
  icon: User,
};
