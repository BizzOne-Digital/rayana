import type { Metadata } from "next";
import {
  generateSystemPageMetadata,
  SystemPage,
} from "@/components/site/SystemPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSystemPageMetadata({ systemKey: "media", path: "/media" });
}

export default function MediaPage() {
  return <SystemPage systemKey="media" />;
}
