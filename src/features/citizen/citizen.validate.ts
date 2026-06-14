import { z } from "zod";
import { Gender } from "@prisma/client";


// Citizen Update Schema
export const citizenUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters")
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters")
    .trim()
    .optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.nativeEnum(Gender)
  ).optional(),
  cartNumber: z
    .string()
    .min(1, "Cart number is required")
    .max(20, "Cart number must not exceed 20 characters")
    .trim()
    .optional(),
  profileImage: z
    .string()
    .max(255, "Profile image URL must not exceed 255 characters")
    .trim()
    .optional()
    .nullable(),
  cartImage: z
    .string()
    .min(1, "Cart image is required")
    .max(255, "Cart image URL must not exceed 255 characters")
    .trim()
    .optional(),
  cartImageBack: z
    .string()
    .max(255, "Cart image back URL must not exceed 255 characters")
    .trim()
    .optional()
    .nullable(),
  updatedBy: z.string().trim().optional(),
});

// Types
export type CitizenUpdateRequest = z.infer<typeof citizenUpdateSchema>;
