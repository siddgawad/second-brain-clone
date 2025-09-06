import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import { collectDefaultMetrics, Registry } from "prom-client";

import { ENV, IS_PROD, ALLOWED_ORIGINS } from "./env";
import { connectMongo } from "./db";
import { pingRedis } from "./redis";
import { logger } from "./logger";

import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import shareRoutes from "./routes/share";
import { errorHandler } from "./middleware/error";

async function main() {
  await connectMongo();
  await pingRedis();

  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true); // allow tools/curl
        if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );

  app.get("/healthz", (_req, res) => res.json({ ok: true }));
  app.get("/readyz", (_req, res) => res.json({ ok: true }));

  const registry = new Registry();
  collectDefaultMetrics({ register: registry });
  app.get("/metrics", async (_req, res) => {
    res.setHeader("Content-Type", registry.contentType);
    res.end(await registry.metrics());
  });

  // Routes
  app.use("/api/v1/auth", authRoutes);      // signup/signin/refresh/logout
  app.use("/api/v1/content", contentRoutes);
  app.use("/api/v1/share", shareRoutes);

  app.use(errorHandler);

  app.listen(ENV.PORT, () => {
    logger.info({ port: ENV.PORT, env: ENV.NODE_ENV }, "listening");
  });
}

main().catch((e) => {
  logger.error(e, "fatal");
  process.exit(1);
});
