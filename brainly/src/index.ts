import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import compression from "compression";
import cors, { type CorsOptions } from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";

import { env } from "./env.js";
import { logger } from "./logger.js";
import { initRedis } from "./redis.js";
import { metricsMiddleware, register } from "./metrics.js";
import { audit } from "./middleware/audit.js";

import { authRouter } from "./routes/auth.js";
import { contentRouter } from "./routes/content.js";
import { shareRouter } from "./routes/share.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

// CORS
const allowedOrigins = env.CORS_ORIGIN.split(",").map(s => s.trim());
const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  }
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use(pinoHttp({ logger }));
app.use(metricsMiddleware);
app.use(audit());

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/metrics", async (_req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.use("/api/v1", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", shareRouter);

app.use((_req, res) => res.status(404).json({ message: "Not found" }));
app.use(errorHandler);

const start = async () => {
  await mongoose.connect(env.MONGO_URL);
  await initRedis();
  app.listen(env.PORT, () => logger.info({ port: env.PORT }, "listening"));
};
start();
