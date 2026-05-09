import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { JwtPayload } from "@/types";

export async function getCurrentUser(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyAccessToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
