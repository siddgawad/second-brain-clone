// src/index.ts (only the relevant bits shown)
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV, ALLOWED_ORIGINS } from "./env.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Mount routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);

// Optional: a tiny health check
app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));

// 404 fallback for unknown API routes
app.use("/api", (_req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(ENV.PORT, () => {
  console.log(`[server] listening on ${ENV.PORT}`);
});
