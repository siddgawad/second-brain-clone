import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() }
});

export type UserDoc = InferSchemaType<typeof userSchema> & {_id: mongoose.Types.ObjectId};
export const User = mongoose.model("User", userSchema);
