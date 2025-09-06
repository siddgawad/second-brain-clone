import { verifyAccessToken } from "../utils/tokens";
import { Request,Response,NextFunction } from "express";

export function requireAuth(req:Request, res:Response, next:NextFunction) {
  const hdr = req.headers.authorization;
  const token = hdr?.startsWith("Bearer ") ? hdr.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Missing access token" });

  try {
    const payload = verifyAccessToken(token); // <— use the real name
    const id = String(payload.sub);
    req.user = payload.email ? { id, email: payload.email } : { id };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid access token" });
  }
}