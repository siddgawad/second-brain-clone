import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/tokens.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing Authorization" });
  const [, token] = header.split(" ");
  try {
    const payload = verifyAccess(token);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid/Expired token" });
  }
}
