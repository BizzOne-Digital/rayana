import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({
    systemKey: "write-a-review",
    path: "/write-a-review",
  });
}

export default function WriteReviewPage() {
  return <SystemPage systemKey="write-a-review" />;
}
