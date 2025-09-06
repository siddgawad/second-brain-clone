import mongoose, { Schema, InferSchemaType } from "mongoose";

const shareSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: "Content", required: true, index: true },
  hash: { type: String, unique: true, index: true, required: true },
  createdAt: { type: Date, default: () => new Date() }
});

export type ShareDoc = InferSchemaType<typeof shareSchema> & {_id: mongoose.Types.ObjectId};
export const Share = mongoose.model("Share", shareSchema);
