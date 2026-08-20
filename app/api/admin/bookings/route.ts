import type { NextRequest } from "next/server";
import {
  jsonOk,
  withAdmin,
} from "@/lib/api/utils";
import { Booking } from "@/models";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query).sort({ startUtc: -1 }).lean();

    return jsonOk({
      bookings: bookings.map((booking) => ({ ...booking, id: String(booking._id) })),
    });
  });
}
