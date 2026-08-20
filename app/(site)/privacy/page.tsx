import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({ systemKey: "privacy", path: "/privacy" });
}

export default function PrivacyPage() {
  return <SystemPage systemKey="privacy" />;
}
