import * as jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { ENV } from "../env";

export type JwtPayload = {
  sub: string;
  email?: string;
  ver?: number;
  jti?: string;
  exp?: number;
  iat?: number;
};

const ACCESS_SECRET: jwt.Secret = ENV.JWT_SECRET;
const REFRESH_SECRET: jwt.Secret = ENV.JWT_REFRESH_SECRET ?? ENV.JWT_SECRET;

export function signAccessToken(userId: string, email?: string) {
  const payload: JwtPayload = { sub: userId };
  if (email) payload.email = email;
  // jwt accepts number (seconds) or string ("15m")
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ENV.ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function signRefreshToken(userId: string, ver?: number) {
  const jti = randomUUID();
  const payload: JwtPayload = { sub: userId, jti };
  if (typeof ver === "number") payload.ver = ver;
  const token = jwt.sign(payload, REFRESH_SECRET, { expiresIn: ENV.REFRESH_TOKEN_TTL });
  return { token, jti };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}