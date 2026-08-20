import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({ systemKey: "pricing", path: "/pricing" });
}

export default function PricingPage() {
  return <SystemPage systemKey="pricing" />;
}
