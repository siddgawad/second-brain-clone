// brainly/src/models/Content.ts
import mongoose, { Schema, InferSchemaType } from 'mongoose';

const AllowedTypes = ['note', 'link', 'tweet', 'video', 'doc', 'image'] as const;

const contentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String }, // optional to match FE
  type: { type: String, enum: AllowedTypes, required: true },
  url: { type: String },   // FE uses `url` (not `link`)
  text: { type: String },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: () => new Date() },
});

export type ContentDoc = InferSchemaType<typeof contentSchema> & { _id: mongoose.Types.ObjectId };
export const Content = mongoose.model('Content', contentSchema);
