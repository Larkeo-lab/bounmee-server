"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citizenUpdateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Citizen Update Schema
exports.citizenUpdateSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must not exceed 50 characters")
        .trim()
        .optional(),
    lastName: zod_1.z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must not exceed 50 characters")
        .trim()
        .optional(),
    dateOfBirth: zod_1.z.coerce.date().optional(),
    gender: zod_1.z.preprocess((val) => (typeof val === "string" ? val.toUpperCase() : val), zod_1.z.nativeEnum(client_1.Gender)).optional(),
    cartNumber: zod_1.z
        .string()
        .min(1, "Cart number is required")
        .max(20, "Cart number must not exceed 20 characters")
        .trim()
        .optional(),
    profileImage: zod_1.z
        .string()
        .max(255, "Profile image URL must not exceed 255 characters")
        .trim()
        .optional()
        .nullable(),
    cartImage: zod_1.z
        .string()
        .min(1, "Cart image is required")
        .max(255, "Cart image URL must not exceed 255 characters")
        .trim()
        .optional(),
    cartImageBack: zod_1.z
        .string()
        .max(255, "Cart image back URL must not exceed 255 characters")
        .trim()
        .optional()
        .nullable(),
    updatedBy: zod_1.z.string().trim().optional(),
});
