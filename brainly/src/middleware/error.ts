import type { ErrorRequestHandler } from "express";
import { logger } from "../logger.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error({ err, path: req.path }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
};
