import * as jwt from "jsonwebtoken";
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_TTL_S,
  REFRESH_TOKEN_TTL_S
} from "../env";

type JwtClaims = { sub: string; email?: string; ver?: number };

// Tell TS these are valid secrets
const ACCESS_SECRET_KEY: jwt.Secret = ACCESS_SECRET;
const REFRESH_SECRET_KEY: jwt.Secret = REFRESH_SECRET;

export function signAccessToken(userId: string, email?: string) {
  const payload: JwtClaims = email ? { sub: userId, email } : { sub: userId };
  return jwt.sign(payload, ACCESS_SECRET_KEY, {
    // **number of seconds** — satisfies v9 types cleanly
    expiresIn: ACCESS_TOKEN_TTL_S
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET_KEY) as jwt.JwtPayload & JwtClaims;
}

export function signRefreshToken(userId: string, ver: number) {
  const payload: JwtClaims = { sub: userId, ver };
  return jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_TTL_S
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET_KEY) as jwt.JwtPayload & JwtClaims;
}

export const cookieOpts = {
  access: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_S
  },
  refresh: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REFRESH_TOKEN_TTL_S
  }
};