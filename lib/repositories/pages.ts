import { Page, type IPage } from "@/models";

export async function listPages(filter: {
  status?: IPage["status"];
  showInNavigation?: boolean;
} = {}): Promise<IPage[]> {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.showInNavigation !== undefined) {
    query.showInNavigation = filter.showInNavigation;
  }

  return Page.find(query).sort({ navigationLabel: 1 }).lean<IPage[]>();
}

export async function getPageById(id: string): Promise<IPage | null> {
  return Page.findById(id).lean<IPage | null>();
}

export async function getPageBySystemKey(systemKey: string): Promise<IPage | null> {
  return Page.findOne({ systemKey }).lean<IPage | null>();
}

export async function getPublishedPageBySlug(slug: string): Promise<IPage | null> {
  return Page.findOne({ slug, status: "published" }).lean<IPage | null>();
}
