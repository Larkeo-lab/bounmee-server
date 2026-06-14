import { z } from "zod";

// Police Department Creation Schema
// Creating a police department also creates its linked User account,
// since User is the shared/central account table (see user.prisma).
export const policeDepartmentCreateSchema = z.object({
  // --- Police department info ---
  departmentName: z
    .string()
    .min(1, "Department name is required")
    .max(50, "Department name must not exceed 50 characters")
    .trim(),
  chiefName: z
    .string()
    .max(50, "Chief name must not exceed 50 characters")
    .trim()
    .optional()
    .nullable(),
  deputyChiefName: z
    .string()
    .max(50, "Deputy chief name must not exceed 50 characters")
    .trim()
    .optional()
    .nullable(),

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

// Police Department Update Schema
export const policeDepartmentUpdateSchema = z.object({
  departmentName: z
    .string()
    .min(1, "Department name is required")
    .max(50, "Department name must not exceed 50 characters")
    .trim()
    .optional(),
  chiefName: z
    .string()
    .max(50, "Chief name must not exceed 50 characters")
    .trim()
    .optional()
    .nullable(),
  deputyChiefName: z
    .string()
    .max(50, "Deputy chief name must not exceed 50 characters")
    .trim()
    .optional()
    .nullable(),
  updatedBy: z.string().trim().optional(),
});

// Types
export type PoliceDepartmentCreateRequest = z.infer<
  typeof policeDepartmentCreateSchema
>;
export type PoliceDepartmentUpdateRequest = z.infer<
  typeof policeDepartmentUpdateSchema
>;
