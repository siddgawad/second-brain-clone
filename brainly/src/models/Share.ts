// brainly/src/models/Share.ts
import mongoose, { Schema, InferSchemaType } from "mongoose";

const shareSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ShareDoc = InferSchemaType<typeof shareSchema> & { _id: mongoose.Types.ObjectId };
export const Share = mongoose.model("Share", shareSchema);
