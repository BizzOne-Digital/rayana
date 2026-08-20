import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withPublicHandler,
} from "@/lib/api/utils";
import { BookingError, rescheduleBooking } from "@/lib/booking/service";
import { expireStaleHolds } from "@/lib/booking/slots";
import { bookingRescheduleSchema } from "@/lib/validation/admin";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const parsed = await parseJsonBody(request, bookingRescheduleSchema);
    if (!parsed.success) return parsed.response;

    await expireStaleHolds();

    try {
      const booking = await rescheduleBooking(parsed.data);

      await logAudit({
        action: "reschedule",
        entityType: "Booking",
        entityId: String(booking._id),
        summary: `Client rescheduled booking ${booking.referenceNumber}`,
        metadata: {
          startUtc: booking.startUtc,
          endUtc: booking.endUtc,
        },
        request,
      });

      return jsonOk({
        booking: serializeDoc(booking),
        rescheduleToken: booking.rescheduleToken,
      });
    } catch (error) {
      if (error instanceof BookingError) {
        const status = error.code === "RESCHEDULE_TOO_LATE" ? 403 : 400;
        return jsonError(error.message, status, { code: error.code });
      }
      throw error;
    }
  });
}
