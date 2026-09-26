import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_KEYWORDS,
} from "@/lib/seo/site-seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rayanaheartmatters.vercel.app",
  ),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: [...SITE_DEFAULT_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: "Rayana De Silva" }],
  creator: "Rayana De Silva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-x-clip">
      <body className="min-h-full overflow-x-clip">{children}</body>
    </html>
  );
}
