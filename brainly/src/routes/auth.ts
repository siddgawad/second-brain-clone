import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { rateLimit, authLimiter } from "../rateLimit.js";
import { signAccess, signRefresh, verifyRefresh } from "../utils/tokens.js";
import cookieParser from "cookie-parser";
import { env } from "../env.js";

export const authRouter = Router();
authRouter.use(cookieParser());

authRouter.post("/signup", rateLimit(authLimiter), async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "username & password required" });
  const exists = await User.findOne({ username });
  if (exists) return res.status(409).json({ message: "user exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash });
  return res.json({ id: user._id, username: user.username });
});

authRouter.post("/signin", rateLimit(authLimiter), async (req, res) => {
  const { username, password } = req.body || {};
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "invalid credentials" });
  const { token: access } = signAccess(String(user._id));
  const { token: refresh } = await signRefresh(String(user._id));
  setRefreshCookie(res, refresh);
  return res.json({ accessToken: access });
});

authRouter.post("/refresh", async (req, res) => {
  const cookie = req.cookies?.refresh_token;
  if (!cookie) return res.status(401).json({ message: "no refresh cookie" });
  try {
    const payload = await verifyRefresh(cookie);
    const { token: access } = signAccess(payload.sub);
    const { token: newRefresh } = await signRefresh(payload.sub, payload.rti);
    setRefreshCookie(res, newRefresh);
    return res.json({ accessToken: access });
  } catch {
    return res.status(401).json({ message: "invalid refresh" });
  }
});

authRouter.post("/logout", async (req, res) => {
  const cookie = req.cookies?.refresh_token;
  if (cookie) {
    try {
      const payload = await verifyRefresh(cookie);
      const { redis } = await import("../redis.js");
      await redis.del(`refresh:${payload.rti}`);
    } catch {}
  }
  res.clearCookie("refresh_token", cookieOpts());
  return res.json({ ok: true });
});

function setRefreshCookie(res: any, token: string) {
  res.cookie("refresh_token", token, cookieOpts());
}
function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: (env.SECURE_COOKIE === "true"),
    domain: env.COOKIE_DOMAIN,
    path: "/",
    maxAge: env.REFRESH_TOKEN_TTL * 1000
  } as const;
}
