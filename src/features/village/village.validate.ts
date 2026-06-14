import { z } from "zod";

// Village Creation Schema
export const villageCreateSchema = z.object({
  code: z
    .string()
    .min(1, "Village code is required")
    .max(100, "Village code must not exceed 100 characters")
    .trim(),
  nameLo: z
    .string()
    .min(1, "Village name (Lao) is required")
    .max(100, "Village name must not exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .max(100, "Village name (English) must not exceed 100 characters")
    .trim(),
  districtCode: z
    .string()
    .min(1, "District code is required")
    .max(100, "District code must not exceed 100 characters")
    .trim()
    .optional()
    .nullable(),
  provinceCode: z
    .string()
    .min(1, "Province code is required")
    .max(100, "Province code must not exceed 100 characters")
    .trim()
    .optional()
    .nullable(),
  createdBy: z.string().trim().optional(),
});

// Village Update Schema
export const villageUpdateSchema = z.object({
  code: z
    .string()
    .min(1, "Village code is required")
    .max(100, "Village code must not exceed 100 characters")
    .trim()
    .optional(),
  nameLo: z
    .string()
    .min(1, "Village name (Lao) is required")
    .max(100, "Village name must not exceed 100 characters")
    .trim()
    .optional(),
  nameEn: z
    .string()
    .max(100, "Village name (English) must not exceed 100 characters")
    .trim()
    .optional(),
  districtCode: z
    .string()
    .max(100, "District code must not exceed 100 characters")
    .trim()
    .optional()
    .nullable(),
  provinceCode: z
    .string()
    .max(100, "Province code must not exceed 100 characters")
    .trim()
    .optional()
    .nullable(),
  updatedBy: z.string().trim().optional(),
});

export const querySchema = z.object({
  districtCode: z.string().optional(),
  provinceCode: z.string().optional(),
});

// Types
export type VillageCreateRequest = z.infer<typeof villageCreateSchema>;
export type VillageUpdateRequest = z.infer<typeof villageUpdateSchema>;
export type VillageQueryRequest = z.infer<typeof querySchema>;
