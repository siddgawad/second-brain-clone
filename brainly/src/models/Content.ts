import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: ["article","video","note"], default: "article" },
  tags: { type: [String], default: [] }
}, { timestamps: true });

export const Content = mongoose.model("Content", ContentSchema);
