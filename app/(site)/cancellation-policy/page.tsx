import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({
    systemKey: "cancellation-policy",
    path: "/cancellation-policy",
  });
}

export default function CancellationPolicyPage() {
  return <SystemPage systemKey="cancellation-policy" />;
}
