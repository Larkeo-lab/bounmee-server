import { z } from "zod";

// District Creation Schema
export const districtCreateSchema = z.object({
  code: z
    .string()
    .min(1, "District code is required")
    .max(20, "District code must not exceed 20 characters")
    .trim(),
  nameLo: z
    .string()
    .min(1, "District name (Lao) is required")
    .max(100, "District name must not exceed 100 characters")
    .trim(),
  nameEn: z
    .string()
    .max(100, "District name (English) must not exceed 100 characters")
    .trim(),
  provinceId: z
    .string()
    .uuid("Invalid province ID format")
    .min(1, "Province ID is required"),
  image: z.string().max(255).optional().nullable(),
  createdBy: z.string().trim().optional(),
});

// District Update Schema
export const districtUpdateSchema = z.object({
  code: z
    .string()
    .min(1, "District code is required")
    .max(20, "District code must not exceed 20 characters")
    .trim()
    .optional(),
  nameLo: z
    .string()
    .min(1, "District name (Lao) is required")
    .max(100, "District name must not exceed 100 characters")
    .trim()
    .optional(),
  nameEn: z
    .string()
    .max(100, "District name (English) must not exceed 100 characters")
    .trim()
    .optional(),
  provinceId: z.string().uuid("Invalid province ID format").optional(),
  image: z.string().max(255).optional().nullable(),
  updatedBy: z.string().trim().optional(),
});

export const querySchema = z.object({
  provinceCode: z.string().optional(),
});

// Types
export type DistrictCreateRequest = z.infer<typeof districtCreateSchema>;
export type DistrictUpdateRequest = z.infer<typeof districtUpdateSchema>;
export type DistrictQueryRequest = z.infer<typeof querySchema>;
