// src/env.ts
import { z } from "zod";

/**
 * Load + validate env once, then export convenient constants.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),

  MONGO_URL: z.string().min(1, "MONGO_URL is required"),

  REDIS_URL: z.string().optional(),

  // Auth
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().optional(), // falls back to JWT_SECRET

  // TTLs in seconds
  ACCESS_TOKEN_TTL: z.coerce.number().default(900),       // 15m
  REFRESH_TOKEN_TTL: z.coerce.number().default(604800),   // 7d (set 2592000 for 30d)

  // CORS + cookies
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  COOKIE_DOMAIN: z.string().optional(),
  SECURE_COOKIE: z
    .string()
    .optional()
    .transform(v => v === "true" || v === "1")
    .pipe(z.boolean().default(false)),

  // Logging
  LOG_LEVEL: z.string().default("info"),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;

// Derived/normalized values
export const ACCESS_SECRET = ENV.JWT_SECRET;
export const REFRESH_SECRET = ENV.JWT_REFRESH_SECRET ?? ENV.JWT_SECRET;

export const ACCESS_TOKEN_TTL_S = ENV.ACCESS_TOKEN_TTL;
export const REFRESH_TOKEN_TTL_S = ENV.REFRESH_TOKEN_TTL;

export const USE_SECURE_COOKIE = ENV.SECURE_COOKIE;

// Split comma-separated origins
export const CORS_ORIGINS = ENV.CORS_ORIGIN.split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Aliases to match the rest of your codebase
export const ALLOWED_ORIGINS = CORS_ORIGINS;
export const IS_PROD = ENV.NODE_ENV === "production";
