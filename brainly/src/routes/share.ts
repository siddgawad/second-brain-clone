// brainly/src/routes/share.ts
import { Router } from "express";
import crypto from "node:crypto";
import { Share } from "../models/Share";
import { Content } from "../models/Content";
import { requireAuth, AuthedRequest } from "../middleware/auth";

// Simple URL-safe slug generator
function genSlug(n = 10) {
  return crypto.randomBytes(Math.ceil(n*0.75)).toString("base64url").slice(0, n);
}

const router = Router();

/**
 * Public: fetch shared content by slug
 * GET /api/v1/share/:slug
 */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const share = await Share.findOne({ slug, enabled: true }).lean();
  if (!share) return res.status(404).json({ error: "Share link not found" });

  const items = await Content.find({ userId: share.userId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  // Return minimal fields; adjust as needed
  res.json({
    owner: share.userId,
    slug,
    items,
  });
});

/**
 * Authenticated: create/enable a share link for the current user
 * POST /api/v1/share
 */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  let share = await Share.findOne({ userId });

  if (!share) {
    share = await Share.create({ userId, slug: genSlug(10), enabled: true });
  } else if (!share.enabled) {
    share.enabled = true;
    await share.save();
  }

  res.status(201).json({
    slug: share.slug,
    url: `/share/${share.slug}`, // frontend path
  });
});

/**
 * Authenticated: disable the share link
 * DELETE /api/v1/share
 */
router.delete("/", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const share = await Share.findOneAndUpdate(
    { userId },
    { $set: { enabled: false } },
    { new: true }
  );
  if (!share) return res.status(404).json({ error: "No share link for user" });
  res.json({ ok: true });
});

export default router;
