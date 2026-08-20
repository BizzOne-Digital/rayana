import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAvailabilityRule extends Document {
  slug: string;
  label: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timeZone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilityRuleSchema = new Schema<IAvailabilityRule>(
  {
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timeZone: { type: String, default: "America/Vancouver" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AvailabilityRuleSchema.index({ active: 1, dayOfWeek: 1 });

export const AvailabilityRule: Model<IAvailabilityRule> =
  mongoose.models.AvailabilityRule ||
  mongoose.model<IAvailabilityRule>("AvailabilityRule", AvailabilityRuleSchema);
