import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ENV, ALLOWED_ORIGINS } from './env';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import { connectMongo } from './db';
import shareRoutes from "./routes/share";

async function start() {
  await connectMongo();

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

  // ✅ Mount under /api/v1
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use("/api/v1/share", shareRoutes);
  // Health
  app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

  // 404 for unknown API paths
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not Found' }));

  app.listen(ENV.PORT, () => {
    console.log(`[server] listening on ${ENV.PORT}`);
  });
}

start().catch((e) => {
  console.error('Failed to start server:', e);
  process.exit(1);
});
