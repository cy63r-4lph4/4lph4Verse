// val/core/middleware/sessionAuth.ts
import type { Request, Response, NextFunction } from "express";

import { verifyVerseSession } from "val/utils/verifyVerseSession";

export async function sessionAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["x-verse-session"] as string;
    if (!token) return res.status(401).json({ error: "Missing session token" });

    const session = await verifyVerseSession(token);
    if (!session) return res.status(401).json({ error: "Invalid session" });

    // Attach user session to request
    req.user = session;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
