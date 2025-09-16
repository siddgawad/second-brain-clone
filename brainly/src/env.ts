// src/env.ts
import 'dotenv/config';
import { z } from 'zod';

const RawEnv = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  MONGO_URL: z.string().min(1, 'MONGO_URL required'),
  REDIS_URL: z.string().optional(),

  // Accept either old or new names – we normalize below.
  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  ACCESS_SECRET: z.string().optional(),
  REFRESH_SECRET: z.string().optional(),

  ACCESS_TOKEN_TTL: z.coerce.number().default(900),          // seconds
  REFRESH_TOKEN_TTL: z.coerce.number().default(60 * 60 * 24 * 30),

  CORS_ORIGIN: z.string().optional(),   // comma separated
  ALLOWED_ORIGINS: z.string().optional(), // comma separated

  COOKIE_DOMAIN: z.string().optional(),
  SECURE_COOKIE: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform(v => v === 'true'),

  LOG_LEVEL: z.string().default('info')
});

const raw = RawEnv.safeParse(process.env);
if (!raw.success) {
  console.error('❌ Invalid environment variables:', raw.error.format());
  process.exit(1);
}
const r = raw.data;

// Normalize secrets (support both naming schemes)
const ACCESS_SECRET = r.ACCESS_SECRET ?? r.JWT_SECRET ?? '';
const REFRESH_SECRET = r.REFRESH_SECRET ?? r.JWT_REFRESH_SECRET ?? r.JWT_SECRET ?? '';

if (!ACCESS_SECRET) {
  console.error('❌ Missing ACCESS_SECRET or JWT_SECRET in .env');
  process.exit(1);
}
if (!REFRESH_SECRET) {
  console.error('❌ Missing REFRESH_SECRET or JWT_REFRESH_SECRET (or JWT_SECRET) in .env');
  process.exit(1);
}

export const IS_PROD = r.NODE_ENV === 'production';
export const PORT = r.PORT;
export const MONGO_URL = r.MONGO_URL;
export const REDIS_URL = r.REDIS_URL;

export const ACCESS_TOKEN_TTL_S = r.ACCESS_TOKEN_TTL;
export const REFRESH_TOKEN_TTL_S = r.REFRESH_TOKEN_TTL;

export const COOKIE_DOMAIN = r.COOKIE_DOMAIN;
export const USE_SECURE_COOKIE = typeof r.SECURE_COOKIE === 'boolean'
  ? r.SECURE_COOKIE
  : IS_PROD;

const originsStr = r.ALLOWED_ORIGINS ?? r.CORS_ORIGIN ?? '';
export const ALLOWED_ORIGINS = originsStr
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export const LOG_LEVEL = r.LOG_LEVEL;

// For modules that still expect a single ENV object:
export const ENV = {
  NODE_ENV: r.NODE_ENV,
  PORT,
  MONGO_URL,
  REDIS_URL,
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_TTL_S,
  REFRESH_TOKEN_TTL_S,
  COOKIE_DOMAIN,
  USE_SECURE_COOKIE,
  ALLOWED_ORIGINS,
  LOG_LEVEL
};

export { ACCESS_SECRET, REFRESH_SECRET };
