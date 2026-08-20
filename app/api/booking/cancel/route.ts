import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withPublicHandler,
} from "@/lib/api/utils";
import { BookingError, cancelBooking } from "@/lib/booking/service";
import { bookingCancelSchema } from "@/lib/validation/admin";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const parsed = await parseJsonBody(request, bookingCancelSchema);
    if (!parsed.success) return parsed.response;

    if (!parsed.data.token && !parsed.data.referenceNumber) {
      return jsonError("Token or reference number is required", 400);
    }

    try {
      const booking = await cancelBooking({
        token: parsed.data.token,
        referenceNumber: parsed.data.referenceNumber,
        reason: parsed.data.reason,
      });

      await logAudit({
        action: "update",
        entityType: "Booking",
        entityId: String(booking._id),
        summary: `Booking ${booking.referenceNumber} cancelled by client`,
        request,
      });

      return jsonOk({ booking: serializeDoc(booking) });
    } catch (error) {
      if (error instanceof BookingError) {
        return jsonError(error.message, 400, { code: error.code });
      }
      throw error;
    }
  });
}
