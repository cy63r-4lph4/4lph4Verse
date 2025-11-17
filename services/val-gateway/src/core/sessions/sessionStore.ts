
const sessions = new Map<string, { address: string; createdAt: number }>();

export function createSession(address: string) {
  const token = Buffer.from(`${address}:${Date.now()}`).toString("base64");

  sessions.set(token, {
    address,
    createdAt: Date.now(),
  });

  return token;
}

export function getSession(token: string) {
  return sessions.get(token);
}

export function deleteSession(token: string) {
  sessions.delete(token);
}
