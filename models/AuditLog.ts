import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAuditLog extends Document {
  action:
    | "create"
    | "update"
    | "delete"
    | "publish"
    | "login"
    | "logout"
    | "payment"
    | "reschedule";
  entityType: string;
  entityId?: Types.ObjectId | string;
  actorId?: Types.ObjectId;
  actorEmail?: string;
  summary: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      enum: [
        "create",
        "update",
        "delete",
        "publish",
        "login",
        "logout",
        "payment",
        "reschedule",
      ],
      required: true,
    },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.Mixed },
    actorId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    actorEmail: { type: String },
    summary: { type: String, required: true },
    changes: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
);

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
