
import jsonwebtoken, { JwtPayload as LibJwtPayload, Secret } from 'jsonwebtoken';
import crypto from 'node:crypto';
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_TTL_S,
  REFRESH_TOKEN_TTL_S,
} from '../env';

// Compatibility for both ESM and CJS builds of jsonwebtoken
const jwt: typeof jsonwebtoken = (jsonwebtoken as any).default ?? jsonwebtoken;

export type AppJwtPayload = {
  sub: string;
  email?: string;
  ver?: number;
  jti?: string;
  exp?: number;
};

const ACCESS_KEY: Secret = ACCESS_SECRET;
const REFRESH_KEY: Secret = REFRESH_SECRET;

export function signAccessToken(userId: string, email?: string) {
  const payload: AppJwtPayload = email ? { sub: userId, email } : { sub: userId };
  return jwt.sign(payload, ACCESS_KEY, { expiresIn: ACCESS_TOKEN_TTL_S });
}

export function verifyAccessToken<T extends object = {}>(token: string) {
  // Merge library payload typing with our app-specific fields
  return jwt.verify(token, ACCESS_KEY) as LibJwtPayload & AppJwtPayload & T;
}

export function signRefreshToken(userId: string, ver: number = 0) {
  const jti = crypto.randomUUID();
  const payload: AppJwtPayload = { sub: userId, ver, jti };
  const token = jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_TOKEN_TTL_S });
  return { token, jti };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_KEY) as LibJwtPayload & AppJwtPayload;
}
