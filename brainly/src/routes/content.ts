// brainly/src/routes/content.ts
import { Router } from 'express';
import type { RequestHandler } from 'express';
import { Content } from '../models/Content';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { contentLimiter } from '../middleware/limiter';

const ALLOWED_TYPES = new Set(['note', 'link', 'tweet', 'video', 'doc', 'image']);

const list: RequestHandler = async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const items = await Content.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json({ items });
};

const create: RequestHandler = async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { title, type, url, text, tags } = req.body ?? {};

  if (!ALLOWED_TYPES.has(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const doc = await Content.create({
    userId,
    title: title || undefined,
    type,
    url: url || undefined,
    text: text || undefined,
    tags: Array.isArray(tags)
      ? tags.filter((t: unknown) => typeof t === 'string')
      : [],
  });

  res.status(201).json({ item: doc });
};

const remove: RequestHandler = async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const found = await Content.findOne({ _id: id, userId });
  if (!found) return res.status(404).json({ error: 'Not found' });
  await Content.deleteOne({ _id: id, userId });
  res.json({ ok: true });
};

const router = Router();
router.get('/', requireAuth, contentLimiter, list);
router.post('/', requireAuth, contentLimiter, create);
router.delete('/:id', requireAuth, contentLimiter, remove);
export default router;
