import { NextRequest, NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/permissions";
import { updateVehicleSchema, vehicleSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    requireRole(session, ["ADMIN", "FLEET_MANAGER", "MECHANIC"]);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where: { organizationId: session.organizationId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vehicle.count({
        where: { organizationId: session.organizationId },
      }),
    ]);

    return NextResponse.json({
      data: vehicles,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    requireRole(session, ["ADMIN", "FLEET_MANAGER"]);

    const body = await request.json();
    const parsed = vehicleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid vehicle payload" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        organizationId: session.organizationId,
        plateNumber: parsed.data.plateNumber,
        make: parsed.data.make,
        model: parsed.data.model,
        year: parsed.data.year,
        status: parsed.data.status ?? "ACTIVE",
      },
    });

    return NextResponse.json({ data: vehicle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create vehicle" }, { status: 500 });
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
