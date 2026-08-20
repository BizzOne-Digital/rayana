import type { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk, withPublicHandler } from "@/lib/api/utils";
import {
  defaultAvailabilityRange,
  expireStaleHolds,
  getAvailableSlots,
  parseServiceDurationMinutes,
} from "@/lib/booking/slots";
import { getBookableService } from "@/lib/repositories/services";
import { getSiteSettings } from "@/lib/repositories/settings";
import { slugSchema } from "@/lib/validation/common";

const availabilityRequestSchema = z.object({
  serviceSlug: slugSchema,
  clientTimeZone: z.string().min(1).max(80),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export async function GET(request: NextRequest) {
  return withPublicHandler(async () => {
    const url = new URL(request.url);
    const parsed = availabilityRequestSchema.safeParse({
      serviceSlug: url.searchParams.get("serviceSlug"),
      clientTimeZone: url.searchParams.get("clientTimeZone"),
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
    });

    if (!parsed.success) {
      return jsonError("Invalid query parameters", 422, parsed.error.flatten());
    }

    const service = await getBookableService(parsed.data.serviceSlug);
    if (!service) {
      return jsonError("Service not found or not bookable", 404);
    }

    await expireStaleHolds();

    const settings = await getSiteSettings();
    const range = parsed.data.from && parsed.data.to
      ? { from: parsed.data.from, to: parsed.data.to }
      : defaultAvailabilityRange();

    const durationMinutes = parseServiceDurationMinutes(service.duration);
    const slots = await getAvailableSlots({
      serviceSlug: service.slug,
      clientTimeZone: parsed.data.clientTimeZone,
      hostTimeZone: settings?.booking.hostTimeZone,
      from: range.from,
      to: range.to,
      durationMinutes,
    });

    return jsonOk({
      serviceSlug: service.slug,
      serviceTitle: service.title,
      durationMinutes,
      clientTimeZone: parsed.data.clientTimeZone,
      hostTimeZone: settings?.booking.hostTimeZone,
      slots,
    });
  });
}
