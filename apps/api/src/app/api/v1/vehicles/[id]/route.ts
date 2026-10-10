import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { updateVehicleSchema } from "@/lib/validation";

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
          include: {
            driver: {
              include: { user: true },
            },
          },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    requireRole(session, ["ADMIN", "FLEET_MANAGER"]);

    const body = await request.json();
    const parsed = updateVehicleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.update({
      where: {
        id: params.id,
        organizationId: session.organizationId,
      },
      data: parsed.data,
    });

    return NextResponse.json({ data: vehicle });
  } catch (error) {
    return NextResponse.json({ error: "Unable to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request);
    requireRole(session, ["ADMIN", "FLEET_MANAGER"]);

    await prisma.vehicle.delete({
      where: {
        id: params.id,
        organizationId: session.organizationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Unable to delete vehicle" }, { status: 500 });
  }
}
