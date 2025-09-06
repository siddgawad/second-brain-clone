import { Router } from "express";
import { z } from "zod";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { Content } from "../models/Content";
import { contentLimiter } from "../middleware/limiter";

const r = Router();

const createSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["note", "link", "tweet", "youtube", "image", "pdf"]),
  link: z.string().url().optional(),
  text: z.string().optional(),
  mediaUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional().default([])
});

r.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const { type, tag } = req.query as { type?: string; tag?: string };
  const q: any = { userId: req.userId };
  if (type) q.type = type;
  if (tag) q.tags = tag;
  const items = await Content.find(q).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

r.post("/", contentLimiter, requireAuth, async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const doc = await Content.create({ ...parsed.data, userId: req.userId });
  res.status(201).json({ item: { ...doc.toObject(), id: doc._id } });
});

r.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const deleted = await Content.findOneAndDelete({ _id: id, userId: req.userId });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default r;
