"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.villageChiefUpdateSchema = exports.villageChiefCreateSchema = void 0;
const zod_1 = require("zod");
// Village Chief Creation Schema
// Creating a village chief also creates its linked User account,
// since User is the shared/central account table (see user.prisma).
exports.villageChiefCreateSchema = zod_1.z.object({
    // --- Village chief info ---
    chiefName: zod_1.z
        .string()
        .min(1, "Chief name is required")
        .max(100, "Chief name must not exceed 100 characters")
        .trim(),
    deputyChiefName: zod_1.z
        .string()
        .min(1, "Deputy chief name is required")
        .max(100, "Deputy chief name must not exceed 100 characters")
        .trim(),
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
// Village Chief Update Schema
exports.villageChiefUpdateSchema = zod_1.z.object({
    chiefName: zod_1.z
        .string()
        .min(1, "Chief name is required")
        .max(100, "Chief name must not exceed 100 characters")
        .trim()
        .optional(),
    deputyChiefName: zod_1.z
        .string()
        .min(1, "Deputy chief name is required")
        .max(100, "Deputy chief name must not exceed 100 characters")
        .trim()
        .optional(),
    // --- Linked User account fields (optional on update) ---
    userName: zod_1.z.string().min(1, "Username is required").optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
    email: zod_1.z.string().email("Invalid email").optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    provinceId: zod_1.z.string().uuid().optional().nullable(),
    districtId: zod_1.z.string().uuid().optional().nullable(),
    villageId: zod_1.z.string().uuid().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
    updatedBy: zod_1.z.string().trim().optional(),
});
