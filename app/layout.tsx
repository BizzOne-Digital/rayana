import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rayana De Silva — Heart Matters",
  description:
    "Private consultations, wisdom mentoring, and teachings for clarity, consciousness, truth, and freedom.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-x-clip">
      <body className="min-h-full overflow-x-clip">{children}</body>
    </html>
  );
}
