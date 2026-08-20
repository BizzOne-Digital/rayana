import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMediaAsset extends Document {
  filename: string;
  originalFilename: string;
  url: string;
  relativePath: string;
  width?: number;
  height?: number;
  mimeType: string;
  bytes: number;
  alt: string;
  caption: string;
  uploadedBy?: string;
  entityType?: string;
  entityId?: Types.ObjectId;
  tags: string[];
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    filename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    url: { type: String, required: true },
    relativePath: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    mimeType: { type: String, required: true },
    bytes: { type: Number, required: true, min: 0 },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    uploadedBy: { type: String },
    entityType: { type: String },
    entityId: { type: Schema.Types.ObjectId },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  { timestamps: true },
);

MediaAssetSchema.index({ filename: 1 }, { unique: true });
MediaAssetSchema.index({ relativePath: 1 }, { unique: true });
MediaAssetSchema.index({ entityType: 1, entityId: 1 });
MediaAssetSchema.index({ status: 1, createdAt: -1 });
MediaAssetSchema.index({ tags: 1 });

export const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ||
  mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
