import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  referenceNumber: string;
  serviceSlug: string;
  serviceId?: Types.ObjectId;
  serviceTitle: string;
  deliveryMode: string;
  clientTimeZone: string;
  hostTimeZone: string;
  startUtc: Date;
  endUtc: Date;
  startLocal: string;
  endLocal: string;
  durationMinutes: number;
  slotKey: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    questions?: string;
    notes?: string;
    recordingRequested: boolean;
    policyConsent: boolean;
  };
  payment: {
    method: "stripe" | "e_transfer";
    status: "pending" | "held" | "paid" | "failed" | "refunded" | "cancelled";
    amount: number;
    currency: string;
    stripePaymentIntentId?: string;
    stripeSessionId?: string;
    eTransferReference?: string;
    paidAt?: Date;
  };
  status:
    | "hold"
    | "pending_payment"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "no_show"
    | "rescheduled";
  holdExpiresAt?: Date;
  rescheduleToken?: string;
  rescheduleTokenExpiresAt?: Date;
  rescheduledFromBookingId?: Types.ObjectId;
  recordingFilePath?: string;
  recordingUrl?: string;
  adminNotes?: string;
  cancelledAt?: Date;
  cancellationReason?: string;
  confirmedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    referenceNumber: { type: String, required: true, unique: true },
    serviceSlug: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    serviceTitle: { type: String, required: true },
    deliveryMode: { type: String, required: true },
    clientTimeZone: { type: String, required: true },
    hostTimeZone: { type: String, required: true, default: "America/Vancouver" },
    startUtc: { type: Date, required: true },
    endUtc: { type: Date, required: true },
    startLocal: { type: String, required: true },
    endLocal: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 15 },
    slotKey: { type: String, required: true },
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String },
      questions: { type: String },
      notes: { type: String },
      recordingRequested: { type: Boolean, default: false },
      policyConsent: { type: Boolean, required: true },
    },
    payment: {
      method: {
        type: String,
        enum: ["stripe", "e_transfer"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "held", "paid", "failed", "refunded", "cancelled"],
        default: "pending",
      },
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "CAD" },
      stripePaymentIntentId: { type: String },
      stripeSessionId: { type: String },
      eTransferReference: { type: String },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: [
        "hold",
        "pending_payment",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
        "rescheduled",
      ],
      default: "hold",
    },
    holdExpiresAt: { type: Date },
    rescheduleToken: { type: String },
    rescheduleTokenExpiresAt: { type: Date },
    rescheduledFromBookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    recordingFilePath: { type: String },
    recordingUrl: { type: String },
    adminNotes: { type: String },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

BookingSchema.index(
  { slotKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["hold", "pending_payment", "confirmed"] },
    },
  },
);
BookingSchema.index({ serviceSlug: 1, startUtc: 1 });
BookingSchema.index({ "client.email": 1, startUtc: -1 });
BookingSchema.index({ status: 1, startUtc: 1 });
BookingSchema.index({ holdExpiresAt: 1 }, { sparse: true });
BookingSchema.index({ "payment.status": 1, status: 1 });
BookingSchema.index({ rescheduleToken: 1 }, { sparse: true });

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export function buildBookingSlotKey(serviceSlug: string, startUtc: Date): string {
  return `${serviceSlug}:${startUtc.toISOString()}`;
}
