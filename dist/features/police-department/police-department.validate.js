"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policeDepartmentUpdateSchema = exports.policeDepartmentCreateSchema = void 0;
const zod_1 = require("zod");
// Police Department Creation Schema
// Creating a police department also creates its linked User account,
// since User is the shared/central account table (see user.prisma).
exports.policeDepartmentCreateSchema = zod_1.z.object({
    // --- Police department info ---
    departmentName: zod_1.z
        .string()
        .min(1, "Department name is required")
        .max(50, "Department name must not exceed 50 characters")
        .trim(),
    chiefName: zod_1.z
        .string()
        .max(50, "Chief name must not exceed 50 characters")
        .trim()
        .optional()
        .nullable(),
    deputyChiefName: zod_1.z
        .string()
        .max(50, "Deputy chief name must not exceed 50 characters")
        .trim()
        .optional()
        .nullable(),
    // --- User account info (User is the central account table) ---
    userName: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    email: zod_1.z.string().email("Invalid email").optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    provinceId: zod_1.z.string().uuid().optional().nullable(),
    districtId: zod_1.z.string().uuid().optional().nullable(),
    villageId: zod_1.z.string().uuid().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
    createdBy: zod_1.z.string().trim().optional(),
});
// Police Department Update Schema
exports.policeDepartmentUpdateSchema = zod_1.z.object({
    departmentName: zod_1.z
        .string()
        .min(1, "Department name is required")
        .max(50, "Department name must not exceed 50 characters")
        .trim()
        .optional(),
    chiefName: zod_1.z
        .string()
        .max(50, "Chief name must not exceed 50 characters")
        .trim()
        .optional()
        .nullable(),
    deputyChiefName: zod_1.z
        .string()
        .max(50, "Deputy chief name must not exceed 50 characters")
        .trim()
        .optional()
        .nullable(),
    updatedBy: zod_1.z.string().trim().optional(),
});
