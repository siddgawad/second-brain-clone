import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

export const env = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  MONGO_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  LOG_LEVEL: z.string().default("info"),
  ACCESS_TOKEN_TTL: z.coerce.number().default(900),
  REFRESH_TOKEN_TTL: z.coerce.number().default(60*60*24*30),
  COOKIE_DOMAIN: z.string().default("localhost"),
  SECURE_COOKIE: z.enum(["true","false"]).default("false")
}).parse(process.env);
