import { SignJWT, jwtVerify } from "jose";
import { JwtPayload } from "@/types";

const getAccessSecret = () => new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "default_access_secret_key");

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getAccessSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    return payload as unknown as JwtPayload;
  } catch (error) {
    return null;
  }
}
