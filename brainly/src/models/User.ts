import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
