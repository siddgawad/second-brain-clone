import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import { Content } from "../models/Content.js";
import { rateLimit, contentLimiter } from "../rateLimit.js";
import { getCache, setCache, delPrefix } from "../cache.js";

export const contentRouter = Router();

contentRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const key = `content:${req.userId}`;
  const cached = await getCache<any[]>(key);
  if (cached) return res.json({ items: cached, cached: true });
  const items = await Content.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
  await setCache(key, items, 30);
  res.json({ items });
});

contentRouter.post("/", requireAuth, rateLimit(contentLimiter), async (req: AuthedRequest, res) => {
  const { title, link, type="article", tags=[] } = req.body || {};
  if (!title || !link) return res.status(400).json({ message: "title & link required" });
  const item = await Content.create({ userId: req.userId, title, link, type, tags });
  await delPrefix(`content:${req.userId}`);
  res.status(201).json(item);
});

contentRouter.delete("/:id", requireAuth, rateLimit(contentLimiter), async (req: AuthedRequest, res) => {
  const doc = await Content.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!doc) return res.status(404).json({ message: "not found" });
  await delPrefix(`content:${req.userId}`);
  res.json({ ok: true });
});
