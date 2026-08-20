import { SiteSettings, type ISiteSettings } from "@/models";

export async function getSiteSettings(): Promise<ISiteSettings | null> {
  return SiteSettings.findOne({ singletonKey: "default" }).lean<ISiteSettings | null>();
}

export async function updateSiteSettings(
  updates: Partial<ISiteSettings>,
): Promise<ISiteSettings | null> {
  return SiteSettings.findOneAndUpdate(
    { singletonKey: "default" },
    { $set: updates },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean<ISiteSettings | null>();
}

export async function getOrCreateSiteSettings(): Promise<ISiteSettings> {
  const existing = await getSiteSettings();
  if (existing) return existing;

  const created = await SiteSettings.create({ singletonKey: "default" });
  return created.toObject() as ISiteSettings;
}
