import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "val/core/sessions/sessionStore";

export async function verifyVerseSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["x-verse-session"] as string;
    if (!token) return res.status(401).json({ error: "Missing session token" });

    const payload = verifyAccessToken(token);
    if (!payload)
      return res.status(401).json({ error: "Invalid or expired token" });
    req.address = payload.address;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
