import {
  BookOpen,
  CalendarDays,
  CreditCard,
  FileText,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  Layers,
  MessageSquare,
  Package,
  Settings,
  Sparkles,
  Star,
  Upload,
  User,
  Video,
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
  { label: "Pricing", href: "/admin/pricing", icon: CreditCard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Media", href: "/admin/media", icon: Video },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Submissions", href: "/admin/submissions", icon: MessageSquare },
  { label: "Uploads", href: "/admin/uploads", icon: Upload },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const adminProfileNav: AdminNavItem = {
  label: "Profile",
  href: "/admin/profile",
  icon: User,
};
