// src/utils/tokens.ts
import * as jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_TTL_S,
  REFRESH_TOKEN_TTL_S
} from '../env';

export type JwtPayload = { sub: string; email?: string; ver?: number; jti?: string; exp?: number };

// Explicit secrets satisfy typings
const ACCESS_KEY: jwt.Secret = ACCESS_SECRET;
const REFRESH_KEY: jwt.Secret = REFRESH_SECRET;

export function signAccessToken(userId: string, email?: string) {
  const payload: JwtPayload = email ? { sub: userId, email } : { sub: userId };
  return jwt.sign(payload, ACCESS_KEY, { expiresIn: ACCESS_TOKEN_TTL_S });
}

export function verifyAccessToken<T extends object = {}>(token: string) {
  return jwt.verify(token, ACCESS_KEY) as jwt.JwtPayload & JwtPayload & T;
}

export function signRefreshToken(userId: string, ver: number = 0) {
  const jti = crypto.randomUUID();
  const payload: JwtPayload = { sub: userId, ver, jti };
  const token = jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_TOKEN_TTL_S });
  return { token, jti };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_KEY) as jwt.JwtPayload & JwtPayload;
}
