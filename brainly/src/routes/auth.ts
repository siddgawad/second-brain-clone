import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { authLimiter } from "../middleware/limiter";
import {
  signAccessToken,
  signRefreshToken,   // returns { token, jti }
  verifyRefreshToken, // reads { sub, ver, jti, exp }
} from "../utils/tokens";
import {
  putRefreshJti,
  getRefreshUserId,
  delRefreshJti,
  getVersion, // per-user version; default 0 if unset
} from "../auth/refreshStore";
import { ENV, USE_SECURE_COOKIE } from "../env";
import type { JwtPayload } from "jsonwebtoken";

const r = Router();

/** ---------- helpers ---------- */

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function toUserOut(u: { _id: unknown; email?: string | null }) {
  const id = String(u._id);
  return u.email ? { id, email: u.email } : { id };
}

function setRefreshCookie(res: any, token: string) {
  const base: Record<string, any> = {
    httpOnly: true,
    sameSite: "lax",
    secure: USE_SECURE_COOKIE,
    path: "/api/v1/auth/refresh",
  };
  // Only set domain if provided (don’t set "localhost")
  if (ENV.COOKIE_DOMAIN && ENV.COOKIE_DOMAIN !== "localhost") {
    base.domain = ENV.COOKIE_DOMAIN;
  }
  res.cookie("refreshToken", token, base);
}

function ttlFromExp(exp?: number): number {
  if (!exp) return 7 * 24 * 60 * 60; // fallback 7d
  const now = Math.floor(Date.now() / 1000);
  return Math.max(1, exp - now);
}

/** ---------- routes ---------- */

/** POST /api/v1/auth/signup */
r.post("/signup", authLimiter, async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  const exists = await User.findOne({ email }).lean();
  if (exists) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });

  const userId = user._id.toString();
  const accessToken = signAccessToken(userId, email);

  // per-user refresh version (defaults to 0 if unset)
  const ver = await getVersion(userId);

  // sign refresh (includes unique jti)
  const { token: refreshToken, jti } = signRefreshToken(userId, ver);

  // compute TTL from JWT exp, store JTI -> userId
  const { exp } = verifyRefreshToken(refreshToken) as JwtPayload;
  await putRefreshJti(jti, userId, ttlFromExp(exp));

  setRefreshCookie(res, refreshToken);
  return res.status(201).json({ accessToken, user: toUserOut(user) });
});

/** POST /api/v1/auth/signin */
r.post("/signin", authLimiter, async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const userId = user._id.toString();
  const accessToken = signAccessToken(userId, user.email ?? undefined);

  const ver = await getVersion(userId);
  const { token: refreshToken, jti } = signRefreshToken(userId, ver);
  const { exp } = verifyRefreshToken(refreshToken) as JwtPayload;
  await putRefreshJti(jti, userId, ttlFromExp(exp));

  setRefreshCookie(res, refreshToken);
  return res.json({ accessToken, user: toUserOut(user) });
});

/** POST /api/v1/auth/refresh
 *  Reads refresh cookie, validates (refresh *not* access), checks JTI + version, rotates.
 */
r.post("/refresh", authLimiter, async (req, res) => {
  const rt = req.cookies?.refreshToken as string | undefined;
  if (!rt) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const payload = verifyRefreshToken(rt) as JwtPayload & {
      sub: string;
      ver?: number;
      jti?: string;
    };
    const userId = String(payload.sub);
    const jti = String(payload.jti);

    // JTI mapping must exist and point to this user
    const stored = await getRefreshUserId(jti);
    if (!stored || stored !== userId) {
      return res.status(401).json({ error: "Refresh token invalidated" });
    }

    // Version must match current
    const currentVer = await getVersion(userId);
    if ((payload.ver ?? 0) !== currentVer) {
      await delRefreshJti(jti);
      return res.status(401).json({ error: "Refresh token is stale" });
    }

    // rotate: delete old mapping
    await delRefreshJti(jti);

    // issue new access + refresh (same version)
    const accessToken = signAccessToken(userId);
    const { token: newRefresh, jti: newJti } = signRefreshToken(userId, currentVer);
    const { exp } = verifyRefreshToken(newRefresh) as JwtPayload;
    await putRefreshJti(newJti, userId, ttlFromExp(exp));

    setRefreshCookie(res, newRefresh);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

/** POST /api/v1/auth/logout
 *  Clears current cookie and deletes the current refresh JTI if it can be parsed.
 *  This does not affect other devices (use "logout-all" to bump version).
 */
r.post("/logout", async (req, res) => {
  const rt = req.cookies?.refreshToken as string | undefined;

  if (rt) {
    try {
      const { jti } = verifyRefreshToken(rt) as JwtPayload & { jti?: string };
      if (jti) await delRefreshJti(String(jti));
    } catch {
      // ignore parsing errors; we still clear the cookie
    }
  }

  res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  return res.json({ ok: true });
});

export default r;
