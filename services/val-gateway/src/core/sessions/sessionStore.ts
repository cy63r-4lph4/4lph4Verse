import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET as string;
const EXPIRESIN = "12h";

export function createSession(address: string) {
  if (!SECRET) throw new Error("JWT_SECRET is missing");

  const token = jwt.sign({ address }, SECRET, { expiresIn: EXPIRESIN });
  return token;
}

export function verifySession(token: string) {
  try {
    const payload = jwt.verify(token, SECRET) as {
      address: string;
      iat: number;
      exp: number;
    };
    return {
      address: payload.address,
    };
  } catch (error) {
    return null;
  }
}
