import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({ systemKey: "terms", path: "/terms" });
}

export default function TermsPage() {
  return <SystemPage systemKey="terms" />;
}
