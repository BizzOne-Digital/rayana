import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  parseJsonBody,
  serializeDoc,
  withPublicHandler,
} from "@/lib/api/utils";
import { BookingError, confirmBooking } from "@/lib/booking/service";
import { sendEmail } from "@/lib/email";
import { bookingConfirmationEmail } from "@/lib/email/templates";
import { bookingConfirmSchema } from "@/lib/validation/admin";

export async function POST(request: NextRequest) {
  return withPublicHandler(async () => {
    const parsed = await parseJsonBody(request, bookingConfirmSchema);
    if (!parsed.success) return parsed.response;

    try {
      const booking = await confirmBooking(
        parsed.data.referenceNumber,
        parsed.data.paymentMethod,
      );

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
      const template = bookingConfirmationEmail({
        clientName: booking.client.name,
        serviceTitle: booking.serviceTitle,
        referenceNumber: booking.referenceNumber,
        startLocal: booking.startLocal,
        endLocal: booking.endLocal,
        clientTimeZone: booking.clientTimeZone,
        paymentMethod: booking.payment.method,
        amount: booking.payment.amount,
        currency: booking.payment.currency,
        rescheduleUrl: booking.rescheduleToken
          ? `${siteUrl}/booking/manage?token=${encodeURIComponent(booking.rescheduleToken)}`
          : undefined,
      });

      await sendEmail({
        to: booking.client.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
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
