import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "30d";

export function createTokens(address: string) {
  if (!SECRET || !REFRESH_SECRET) {
    throw new Error("JWT secrets missing");
  }

  const accessToken = jwt.sign({ address }, SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });

  const refreshToken = jwt.sign({ address }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });

  return { accessToken, refreshToken };
}
export function verifyAccessToken(token: string) {
  try {
    const payload = jwt.verify(token, SECRET) as {
      address: string;
      iat: number;
      exp: number;
    };

    return { address: payload.address };
  } catch {
    return null;
  }
}
export function verifyRefreshToken(token: string) {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as {
      address: string;
      iat: number;
      exp: number;
    };

    return { address: payload.address };
  } catch {
    return null;
  }
}
