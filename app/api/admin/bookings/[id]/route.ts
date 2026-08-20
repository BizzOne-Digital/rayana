import type { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { Booking } from "@/models";
import { bookingAdminUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { id } = await context.params;
    const booking = await Booking.findById(id).lean();
    if (!booking) return jsonError("Booking not found", 404);
    return jsonOk({ booking: { ...booking, id: String(booking._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const parsed = await parseJsonBody(request, bookingAdminUpdateSchema);
    if (!parsed.success) return parsed.response;

    const updates: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === "cancelled") {
      updates.cancelledAt = new Date();
    }
    if (parsed.data.status === "confirmed") {
      updates.confirmedAt = new Date();
    }
    if (parsed.data.status === "completed") {
      updates.completedAt = new Date();
    }

    const booking = await Booking.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!booking) return jsonError("Booking not found", 404);

    await logAudit({
      action: updates.status === "rescheduled" ? "reschedule" : "update",
      entityType: "Booking",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated booking ${booking.referenceNumber}`,
      changes: updates as Record<string, unknown>,
      request,
    });

    return jsonOk({ booking: serializeDoc(booking) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { id } = await context.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: "Cancelled by admin",
        },
      },
      { new: true },
    );

    if (!booking) return jsonError("Booking not found", 404);

    await logAudit({
      action: "delete",
      entityType: "Booking",
      entityId: id,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Cancelled booking ${booking.referenceNumber}`,
      request,
    });

    return jsonOk({ booking: serializeDoc(booking) });
  });
}
