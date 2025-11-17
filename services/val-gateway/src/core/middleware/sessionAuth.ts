// val/core/middleware/sessionAuth.ts
import { verifyVerseSession } from "val/utils/verifySession";

export async function sessionAuth(req, res, next) {
  try {
    const token = req.headers["x-verse-session"];
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
