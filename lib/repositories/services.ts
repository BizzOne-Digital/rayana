import { Service, type IService } from "@/models";

export async function listServices(filter: {
  status?: IService["status"];
  bookable?: boolean;
  featured?: boolean;
} = {}): Promise<IService[]> {
  const query: Record<string, unknown> = {};
  if (filter.status) query.status = filter.status;
  if (filter.bookable !== undefined) query.bookable = filter.bookable;
  if (filter.featured !== undefined) query.featured = filter.featured;

  return Service.find(query).sort({ displayOrder: 1, title: 1 }).lean<IService[]>();
}

export async function getServiceById(id: string): Promise<IService | null> {
  return Service.findById(id).lean<IService | null>();
}

export async function getServiceBySlug(slug: string): Promise<IService | null> {
  return Service.findOne({ slug }).lean<IService | null>();
}

export async function getBookableService(slug: string): Promise<IService | null> {
  return Service.findOne({ slug, status: "active", bookable: true }).lean<IService | null>();
}

export function getEffectivePrice(service: IService): number {
  if (service.specialOfferActive && service.specialPrice != null) {
    return service.specialPrice;
  }
  return service.standardPrice ?? 0;
}
