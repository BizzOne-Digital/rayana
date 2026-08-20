import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlackoutDate extends Document {
  slug: string;
  label: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  timeZone: string;
  reason?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlackoutDateSchema = new Schema<IBlackoutDate>(
  {
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    allDay: { type: Boolean, default: true },
    startTime: { type: String },
    endTime: { type: String },
    timeZone: { type: String, default: "America/Vancouver" },
    reason: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

BlackoutDateSchema.index({ active: 1, startDate: 1, endDate: 1 });

export const BlackoutDate: Model<IBlackoutDate> =
  mongoose.models.BlackoutDate ||
  mongoose.model<IBlackoutDate>("BlackoutDate", BlackoutDateSchema);
