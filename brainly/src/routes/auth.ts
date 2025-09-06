import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { authLimiter } from "../middleware/limiter"; // or "../rateLimit" if that's your file
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";
import {
  putRefreshJti,
  getRefreshUserId,
  delRefreshJti,
  // getVersion, // optional
} from "../auth/refreshStore";
import { ENV, USE_SECURE_COOKIE } from "../env";

const r = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// central cookie setter
function setRefreshCookie(res: any, token: string) {
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: USE_SECURE_COOKIE,
    path: "/api/v1/auth/refresh",
  } as Record<string, any>;

  if (ENV.COOKIE_DOMAIN && ENV.COOKIE_DOMAIN !== "localhost") {
    base.domain = ENV.COOKIE_DOMAIN;
  }
  res.cookie("refreshToken", token, base);
}

function toUserOut(u: { _id: any; email?: string }) {
  return u.email ? { id: String(u._id), email: u.email } : { id: String(u._id) };
}

r.post("/signup", authLimiter, async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const existing = await User.findOne({ email }).lean();
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });

  const accessToken = signAccessToken(user._id.toString(), user.email);
  // const ver = await getVersion(user._id.toString()); // optional
  const { token: refresh, jti } = signRefreshToken(user._id.toString());

  // compute TTL from token exp
  const payload = verifyRefreshToken(refresh);
  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.max(1, (payload.exp ?? now) - now);
  await putRefreshJti(jti, user._id.toString(), ttl);

  setRefreshCookie(res, refresh);
  res.status(201).json({ accessToken, user: toUserOut(user) });
});

r.post("/signin", authLimiter, async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken(user._id.toString(), user.email);
  const { token: refresh, jti } = signRefreshToken(user._id.toString());
  const payload = verifyRefreshToken(refresh);
  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.max(1, (payload.exp ?? now) - now);
  await putRefreshJti(jti, user._id.toString(), ttl);

  setRefreshCookie(res, refresh);
  res.json({ accessToken, user: toUserOut(user) });
});

r.post("/refresh", authLimiter, async (req, res) => {
  const rt = req.cookies?.refreshToken as string | undefined;
  if (!rt) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const payload = verifyRefreshToken(rt);
    const jti = payload.jti!;
    const userId = payload.sub;

    const storedUser = await getRefreshUserId(jti);
    if (!storedUser || storedUser !== userId) {
      return res.status(401).json({ error: "Refresh token invalidated" });
    }

    // Rotate: delete old jti and issue new pair
    await delRefreshJti(jti);

    const accessToken = signAccessToken(userId);
    const { token: newRefresh, jti: newJti } = signRefreshToken(userId);
    const newPayload = verifyRefreshToken(newRefresh);
    const now = Math.floor(Date.now() / 1000);
    const ttl = Math.max(1, (newPayload.exp ?? now) - now);
    await putRefreshJti(newJti, userId, ttl);

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

r.post("/logout", async (req, res) => {
  const rt = req.cookies?.refreshToken as string | undefined;
  if (rt) {
    try {
      const payload = verifyRefreshToken(rt);
      if (payload.jti) await delRefreshJti(payload.jti);
    } catch {}
  }
  res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });
  res.json({ ok: true });
});

export default r;