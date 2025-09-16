// src/routes/content.ts
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { Content } from "../models/Content.js";

const r = Router();

// List content (optional filters: ?type=tweet|video|doc|link and/or ?tag=xxx)
r.get("/", requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const { type, tag } = req.query;

  const q: any = { userId };
  if (typeof type === "string") q.type = type;
  if (typeof tag === "string") q.tags = tag;

  const items = await Content.find(q).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

// Create a card
const createSchema = z.object({
  // kind/type of item
  type: z.enum(["tweet", "video", "doc", "link", "image", "note"]),
  title: z.string().min(1).max(200).optional(),
  url: z.string().url().optional(),          // for tweets, youtube, links
  text: z.string().max(10000).optional(),    // for notes
  tags: z.array(z.string().min(1).max(32)).optional(),
});

r.post("/", requireAuth, async (req, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  const { type, title, url, text, tags } = parse.data;
  const item = await Content.create({
    userId: req.user!.id,
    type,
    title,
    url,
    text,
    tags: tags ?? [],
  });

  res.status(201).json({ item });
});

// Delete a card
r.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const doc = await Content.findOne({ _id: id, userId: req.user!.id });
  if (!doc) return res.status(404).json({ error: "Not found" });

  await doc.deleteOne();
  res.json({ ok: true });
});

export default r;
