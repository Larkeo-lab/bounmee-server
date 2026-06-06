"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceUpdateSchema = exports.provinceCreateSchema = void 0;
const zod_1 = require("zod");
// Province Creation Schema
exports.provinceCreateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "Province code is required")
        .max(20, "Province code must not exceed 20 characters")
        .trim(),
    nameLo: zod_1.z
        .string()
        .min(1, "Province name (Lao) is required")
        .max(100, "Province name must not exceed 100 characters")
        .trim(),
    nameEn: zod_1.z
        .string()
        .max(100, "Province name (English) must not exceed 100 characters")
        .trim(),
    createdBy: zod_1.z.string().trim().optional(),
});
// Province Update Schema
exports.provinceUpdateSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(1, "Province code is required")
        .max(20, "Province code must not exceed 20 characters")
        .trim()
        .optional(),
    nameLo: zod_1.z
        .string()
        .min(1, "Province name (Lao) is required")
        .max(100, "Province name must not exceed 100 characters")
        .trim()
        .optional(),
    nameEn: zod_1.z
        .string()
        .max(100, "Province name (English) must not exceed 100 characters")
        .trim()
        .optional(),
    updatedBy: zod_1.z.string().trim().optional(),
});
