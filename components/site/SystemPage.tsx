import type { Metadata } from "next";
import { PageRenderer } from "@/components/sections/PageRenderer";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicPage, getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

type SystemPageProps = {
  systemKey: string;
  path: string;
};

export async function generateSystemPageMetadata({
  systemKey,
  path,
}: SystemPageProps): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage(systemKey),
    getPublicSettings(),
  ]);
  return buildMetadata({
    title: page?.title,
    seo: page?.seo,
    settings,
    path,
  });
}

export async function SystemPage({ systemKey }: { systemKey: string }) {
  const [page, context] = await Promise.all([
    getPublicPage(systemKey),
    buildSectionContext(),
  ]);

  if (!page) return null;
  return <PageRenderer sections={page.sections} context={context} />;
}
