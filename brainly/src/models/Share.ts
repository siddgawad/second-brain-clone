import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true, index: true },
  hash: { type: String, unique: true, index: true, required: true }
}, { timestamps: true });

export const Share = mongoose.model("Share", ShareSchema);
