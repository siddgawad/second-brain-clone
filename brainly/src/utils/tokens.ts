import jwt from "jsonwebtoken";
import { env } from "../env.js";
import { redis } from "../redis.js";
import crypto from "crypto";

export type AccessPayload = { sub: string; jti: string };
export type RefreshPayload = { sub: string; rti: string };

export function signAccess(userId: string) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: userId, jti } as AccessPayload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
  return { token, jti };
}

export async function signRefresh(userId: string, oldRti?: string) {
  if (oldRti) await redis.del(`refresh:${oldRti}`);
  const rti = crypto.randomUUID();
  const token = jwt.sign({ sub: userId, rti } as RefreshPayload, env.JWT_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL });
  await redis.set(`refresh:${rti}`, userId, { EX: env.REFRESH_TOKEN_TTL });
  return { token, rti };
}

export function verifyAccess(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AccessPayload & jwt.JwtPayload;
}

export async function verifyRefresh(token: string) {
  const payload = jwt.verify(token, env.JWT_SECRET) as RefreshPayload & jwt.JwtPayload;
  const exists = await redis.get(`refresh:${payload.rti}`);
  if (!exists) throw new Error("refresh token invalidated");
  return payload;
}
