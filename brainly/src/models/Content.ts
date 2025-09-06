import mongoose, { Schema, InferSchemaType } from "mongoose";

const contentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["note", "link", "tweet", "youtube", "image", "pdf"], required: true },
  link: { type: String },
  text: { type: String },
  mediaUrl: { type: String },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: () => new Date() }
});

export type ContentDoc = InferSchemaType<typeof contentSchema> & {_id: mongoose.Types.ObjectId};
export const Content = mongoose.model("Content", contentSchema);
