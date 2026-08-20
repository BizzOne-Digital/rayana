import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({ systemKey: "disclaimer", path: "/disclaimer" });
}

export default function DisclaimerPage() {
  return <SystemPage systemKey="disclaimer" />;
}
