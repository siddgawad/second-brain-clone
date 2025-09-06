import { Router } from "express";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { Content } from "../models/Content";
import { Share } from "../models/Share";
import { randomId } from "../utils/hash";

const r = Router();

r.post("/:contentId", requireAuth, async (req: AuthedRequest, res) => {
  const { contentId } = req.params;
  const content = await Content.findOne({ _id: contentId, userId: req.userId }).lean();
  if (!content) return res.status(404).json({ error: "Not found" });

  const hash = randomId(10);
  const share = await Share.create({ contentId: content._id, hash });
  res.status(201).json({ hash, url: `/api/v1/share/${hash}` });
});

r.get("/:hash", async (req, res) => {
  const { hash } = req.params;
  const share = await Share.findOne({ hash }).lean();
  if (!share) return res.status(404).json({ error: "Not found" });
  const content = await Content.findById(share.contentId).lean();
  if (!content) return res.status(404).json({ error: "Not found" });
  res.json({
    title: content.title,
    type: content.type,
    link: content.link,
    text: content.text,
    mediaUrl: content.mediaUrl,
    tags: content.tags,
    createdAt: content.createdAt
  });
});

export default r;
