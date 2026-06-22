"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.districtUpdateSchema = exports.districtCreateSchema = void 0;
const zod_1 = require("zod");
// District Creation Schema
exports.districtCreateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "District code is required")
        .max(20, "District code must not exceed 20 characters")
        .trim(),
    nameLo: zod_1.z
        .string()
        .min(1, "District name (Lao) is required")
        .max(100, "District name must not exceed 100 characters")
        .trim(),
    nameEn: zod_1.z
        .string()
        .max(100, "District name (English) must not exceed 100 characters")
        .trim(),
    provinceId: zod_1.z
        .string()
        .uuid("Invalid province ID format")
        .min(1, "Province ID is required"),
    image: zod_1.z.string().max(255).optional().nullable(),
    createdBy: zod_1.z.string().trim().optional(),
});
// District Update Schema
exports.districtUpdateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "District code is required")
        .max(20, "District code must not exceed 20 characters")
        .trim()
        .optional(),
    nameLo: zod_1.z
        .string()
        .min(1, "District name (Lao) is required")
        .max(100, "District name must not exceed 100 characters")
        .trim()
        .optional(),
    nameEn: zod_1.z
        .string()
        .max(100, "District name (English) must not exceed 100 characters")
        .trim()
        .optional(),
    provinceId: zod_1.z.string().uuid("Invalid province ID format").optional(),
    image: zod_1.z.string().max(255).optional().nullable(),
    updatedBy: zod_1.z.string().trim().optional(),
});
exports.querySchema = zod_1.z.object({
    provinceCode: zod_1.z.string().optional(),
});
