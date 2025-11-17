import { getSession } from "val/core/sessions/sessionStore";

export async function verifyVerseSession(token: string) {
  const session = getSession(token);
  if (!session) return null;

  const MAX_AGE = 12 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > MAX_AGE) {
    return null;
  }

  return {
    address: session.address,
    createdAt: session.createdAt,
  };
}
