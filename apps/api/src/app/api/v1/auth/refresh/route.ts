import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { createAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email/password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const refreshToken = await createAccessToken({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    return NextResponse.json({
      data: {
        accessToken: refreshToken,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
