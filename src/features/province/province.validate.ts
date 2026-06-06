import { z } from "zod";

// Province Creation Schema
export const provinceCreateSchema = z.object({
  code: z
    .string()
    .min(1, "Province code is required")
    .max(20, "Province code must not exceed 20 characters")
    .trim(),
  nameLo: z
    .string()
    .min(1, "Province name (Lao) is required")
    .max(100, "Province name must not exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .max(100, "Province name (English) must not exceed 100 characters")
    .trim(),
  createdBy: z.string().trim().optional(),
});

// Province Update Schema
export const provinceUpdateSchema = z.object({
  code: z
    .string()
    .min(1, "Province code is required")
    .max(20, "Province code must not exceed 20 characters")
    .trim()
    .optional(),
  nameLo: z
    .string()
    .min(1, "Province name (Lao) is required")
    .max(100, "Province name must not exceed 100 characters")
    .trim()
    .optional(),
  nameEn: z
    .string()
    .max(100, "Province name (English) must not exceed 100 characters")
    .trim()
    .optional(),
  updatedBy: z.string().trim().optional(),
});

// Types
export type ProvinceCreateRequest = z.infer<typeof provinceCreateSchema>;
export type ProvinceUpdateRequest = z.infer<typeof provinceUpdateSchema>;
