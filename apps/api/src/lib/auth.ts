import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-key"
);

export type SessionUser = {
  userId: string;
  organizationId: string;
  role: "ADMIN" | "FLEET_MANAGER" | "MECHANIC" | "DRIVER";
};

export async function createAccessToken(user: SessionUser) {
  return new SignJWT({
    userId: user.userId,
    organizationId: user.organizationId,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionUser;
}

export async function getSessionFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.replace("Bearer ", "");
  return verifyToken(token);
}
