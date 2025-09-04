import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import { Share } from "../models/Share.js";
import { Content } from "../models/Content.js";
import { randomHash } from "../utils/hash.js";
import { getCache, setCache, delPrefix } from "../cache.js";

export const shareRouter = Router();

shareRouter.post("/:contentId", requireAuth, async (req: AuthedRequest, res) => {
  const { contentId } = req.params;
  const content = await Content.findOne({ _id: contentId, userId: req.userId });
  if (!content) return res.status(404).json({ message: "content not found" });
  let hash = randomHash();
  let tries = 0;
  while (tries < 5 && await Share.findOne({ hash })) { hash = randomHash(); tries++; }
  const share = await Share.create({ contentId: content._id, hash });
  await delPrefix(`share:${hash}`);
  res.status(201).json({ hash });
});

shareRouter.get("/all", requireAuth, async (req: AuthedRequest, res) => {
    const shares = await Share.find({}).lean(); // list of { contentId, hash }
    const ids = shares.map(s => s.contentId);
    const userContent = await Content.find({ userId: req.userId, _id: { $in: ids } }).lean();
  
    const map = new Map(userContent.map(c => [String(c._id), c]));
    const items = shares
      .map(s => {
        const c = map.get(String(s.contentId));
        return c ? { hash: s.hash, content: c } : null;
      })
      .filter(Boolean);
  
    res.json({ items });
  });
shareRouter.get("/:hash", async (req, res) => {
    const share = await Share.findOne({ hash: req.params.hash }).lean();
    if (!share) return res.status(404).json({ message: "not found" });
  
    const content = await Content.findById(share.contentId).lean();
    if (!content) return res.status(404).json({ message: "not found" });
  
    const payload = { title: content.title, link: content.link, type: content.type };
    await setCache(`share:${req.params.hash}`, payload, 60);
    res.json(payload);
  });