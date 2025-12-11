import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../core/sessions/sessionStore";

// Extend Express Request to include address
export interface VerseRequest extends Request {
  address?: string;
}

export async function verifyVerseSession(
  req: VerseRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["x-verse-session"];
    if (!token || typeof token !== "string") {
      return res.status(401).json({ error: "Missing session token" });
    }

    const payload = verifyAccessToken(token);
    if (!payload || !payload.address) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.address = payload.address;
    next();
  } catch (err) {
    console.error("Session verification error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
