import { z } from "zod";

// Police District Creation Schema
// Creating a police district also creates its linked User account,
// since User is the shared/central account table (see user.prisma).
export const policeDistrictCreateSchema = z.object({
  // --- Police district info ---
  chiefName: z
    .string()
    .min(1, "Chief name is required")
    .max(100, "Chief name must not exceed 100 characters")
    .trim(),
  deputyChiefName: z
    .string()
    .min(1, "Deputy chief name is required")
    .max(100, "Deputy chief name must not exceed 100 characters")
    .trim(),
  image: z.string().max(255).optional().nullable(),
  bgImage: z.string().max(255).optional().nullable(),

  // --- User account info (User is the central account table) ---
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  // Location is given by CODE (resolved to ids on the server)
  provinceCode: z.string().optional().nullable(),
  districtCode: z.string().optional().nullable(),
  villageCode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),

  createdBy: z.string().trim().optional(),
});

// Police District Update Schema
export const policeDistrictUpdateSchema = z.object({
  chiefName: z
    .string()
    .min(1, "Chief name is required")
    .max(100, "Chief name must not exceed 100 characters")
    .trim()
    .optional(),
  deputyChiefName: z
    .string()
    .min(1, "Deputy chief name is required")
    .max(100, "Deputy chief name must not exceed 100 characters")
    .trim()
    .optional(),
  image: z.string().max(255).optional().nullable(),
  bgImage: z.string().max(255).optional().nullable(),

  // --- Linked User account fields (optional on update) ---
  userName: z.string().min(1, "Username is required").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  // Location is given by CODE (resolved to ids on the server)
  provinceCode: z.string().optional().nullable(),
  districtCode: z.string().optional().nullable(),
  villageCode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),

  updatedBy: z.string().trim().optional(),
});

// Types
export type PoliceDistrictCreateRequest = z.infer<
  typeof policeDistrictCreateSchema
>;
export type PoliceDistrictUpdateRequest = z.infer<
  typeof policeDistrictUpdateSchema
>;
