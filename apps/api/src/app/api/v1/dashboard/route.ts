import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    requireRole(session, ["ADMIN", "FLEET_MANAGER", "MECHANIC", "DRIVER"]);

    const [totalVehicles, activeVehicles, maintenanceVehicles] = await Promise.all([
      prisma.vehicle.count({ where: { organizationId: session.organizationId } }),
      prisma.vehicle.count({
        where: { organizationId: session.organizationId, status: "ACTIVE" },
      }),
      prisma.vehicle.count({
        where: { organizationId: session.organizationId, status: "MAINTENANCE" },
      }),
    ]);

    return NextResponse.json({
      data: {
        totalVehicles,
        activeVehicles,
        vehiclesInMaintenance: maintenanceVehicles,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
