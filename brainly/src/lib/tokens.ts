// src/lib/tokens.ts
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { env } from '../env';

type JwtPayload = { sub: string; typ: 'access' | 'refresh' };
const ACCESS_TTL_SEC = 15 * 60; // 15m
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60; // 7d

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId, typ: 'access' } satisfies JwtPayload, env.JWT_SECRET, { expiresIn: ACCESS_TTL_SEC });
}
export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId, typ: 'refresh' } satisfies JwtPayload, env.JWT_SECRET, { expiresIn: REFRESH_TTL_SEC });
}
export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload & jwt.JwtPayload;
}

export function setRefreshCookie(res: Response, token: string) {
  // For local dev across 5173→3000 you need SameSite=None and Secure=true in modern browsers.
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: true,                // keep true; in Chrome you need HTTPS. If testing on http://localhost, add chrome flag or temporarily set false.
    sameSite: 'none',
    path: '/api/v1/auth/refresh',
    maxAge: REFRESH_TTL_SEC * 1000,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/api/v1/auth/refresh',
  });
}
