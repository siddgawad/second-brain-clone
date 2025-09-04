import type { NextFunction, Response } from "express";
import { logger } from "../logger.js";
import type { AuthedRequest } from "./auth.js";

export function audit() {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
      const latency = Date.now() - start;
      logger.info({
        userId: req.userId || "anon",
        ip: (req.headers["x-forwarded-for"] || req.socket.remoteAddress),
        method: req.method,
        route: req.originalUrl,
        status: res.statusCode,
        latency
      }, "http");
    });
    next();
  };
}
