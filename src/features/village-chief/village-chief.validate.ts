import { z } from "zod";

// Village Chief Creation Schema
// Creating a village chief also creates its linked User account,
// since User is the shared/central account table (see user.prisma).
export const villageChiefCreateSchema = z.object({
  // --- Village chief info ---
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

  // --- User account info (User is the central account table) ---
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  provinceId: z.string().uuid().optional().nullable(),
  districtId: z.string().uuid().optional().nullable(),
  villageId: z.string().uuid().optional().nullable(),
  address: z.string().optional().nullable(),

  createdBy: z.string().trim().optional(),
});

// Village Chief Update Schema
export const villageChiefUpdateSchema = z.object({
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

  // --- Linked User account fields (optional on update) ---
  userName: z.string().min(1, "Username is required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  provinceId: z.string().uuid().optional().nullable(),
  districtId: z.string().uuid().optional().nullable(),
  villageId: z.string().uuid().optional().nullable(),
  address: z.string().optional().nullable(),

  updatedBy: z.string().trim().optional(),
});

// Types
export type VillageChiefCreateRequest = z.infer<
  typeof villageChiefCreateSchema
>;
export type VillageChiefUpdateRequest = z.infer<
  typeof villageChiefUpdateSchema
>;
