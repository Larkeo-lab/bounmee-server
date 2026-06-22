"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.villageUpdateSchema = exports.villageCreateSchema = void 0;
const zod_1 = require("zod");
// Village Creation Schema
exports.villageCreateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "Village code is required")
        .max(100, "Village code must not exceed 100 characters")
        .trim(),
    nameLo: zod_1.z
        .string()
        .min(1, "Village name (Lao) is required")
        .max(100, "Village name must not exceed 100 characters")
        .trim(),
    nameEn: zod_1.z
        .string()
        .max(100, "Village name (English) must not exceed 100 characters")
        .trim(),
    districtCode: zod_1.z
        .string()
        .min(1, "District code is required")
        .max(100, "District code must not exceed 100 characters")
        .trim()
        .optional()
        .nullable(),
    provinceCode: zod_1.z
        .string()
        .min(1, "Province code is required")
        .max(100, "Province code must not exceed 100 characters")
        .trim()
        .optional()
        .nullable(),
    image: zod_1.z
        .string()
        .max(255, "Image must not exceed 255 characters")
        .trim()
        .optional()
        .nullable(),
    createdBy: zod_1.z.string().trim().optional(),
});
// Village Update Schema
exports.villageUpdateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "Village code is required")
        .max(100, "Village code must not exceed 100 characters")
        .trim()
        .optional(),
    nameLo: zod_1.z
        .string()
        .min(1, "Village name (Lao) is required")
        .max(100, "Village name must not exceed 100 characters")
        .trim()
        .optional(),
    nameEn: zod_1.z
        .string()
        .max(100, "Village name (English) must not exceed 100 characters")
        .trim()
        .optional(),
    districtCode: zod_1.z
        .string()
        .max(100, "District code must not exceed 100 characters")
        .trim()
        .optional()
        .nullable(),
    provinceCode: zod_1.z
        .string()
        .max(100, "Province code must not exceed 100 characters")
        .trim()
        .optional()
        .nullable(),
    image: zod_1.z
        .string()
        .max(255, "Image must not exceed 255 characters")
        .trim()
        .optional()
        .nullable(),
    updatedBy: zod_1.z.string().trim().optional(),
});
exports.querySchema = zod_1.z.object({
    districtCode: zod_1.z.string().optional(),
    provinceCode: zod_1.z.string().optional(),
});
