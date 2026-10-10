import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: "fleetgo-demo-org" },
    update: {},
    create: {
      id: "fleetgo-demo-org",
      name: "FleetGo Demo Org",
    },
  });

  const passwordHash = await bcrypt.hash("secret123", 10);

  await prisma.user.upsert({
    where: { email: "admin@fleetgo.io" },
    update: {},
    create: {
      organizationId: org.id,
      fullName: "Fleet Admin",
      email: "admin@fleetgo.io",
      passwordHash,
      role: "ADMIN",
    },
  });

  const vehicles = [
    {
      organizationId: org.id,
      plateNumber: "ABC-1234",
      make: "Toyota",
      model: "Hiace",
      year: 2022,
      status: "ACTIVE",
    },
    {
      organizationId: org.id,
      plateNumber: "XYZ-8891",
      make: "Isuzu",
      model: "Elf",
      year: 2021,
      status: "MAINTENANCE",
    },
    {
      organizationId: org.id,
      plateNumber: "LRT-9902",
      make: "Ford",
      model: "Transit",
      year: 2023,
      status: "ACTIVE",
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: {
        organizationId_plateNumber: {
          organizationId: vehicle.organizationId,
          plateNumber: vehicle.plateNumber,
        },
      },
      update: {},
      create: vehicle,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
