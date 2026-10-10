import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const vehicleSchema = z.object({
  plateNumber: z.string().min(2).max(20),
  make: z.string().min(2),
  model: z.string().min(2),
  year: z.number().int().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE", "RETIRED"]).optional(),
});

export const updateVehicleSchema = vehicleSchema.partial();
