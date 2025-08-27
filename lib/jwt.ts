import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "trailmate_secret";

export function signJwt(payload: object, expiresIn: string = "7d") {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET as string, options);
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch {
    return null;
  }
}
