import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    requireRole(session, ["ADMIN", "FLEET_MANAGER", "MECHANIC", "DRIVER"]);

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: params.id,
        organizationId: session.organizationId,
      },
      include: {
        assignments: {
          include: { driver: { include: { user: true } } },
          where: { endAt: null },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ data: vehicle });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
