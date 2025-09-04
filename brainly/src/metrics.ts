import client from "prom-client";
import type { Request, Response, NextFunction } from "express";

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [5, 10, 25, 50, 100, 200, 400, 800, 1600]
});

register.registerMetric(httpRequestDuration);

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const route = (req.route && req.route.path) || req.path || "unknown";
    httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(duration);
  });
  next();
}
