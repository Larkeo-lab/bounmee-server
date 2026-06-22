"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQuerySchema = exports.reportUpdateSchema = exports.reportCreateSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Report Creation Schema
exports.reportCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must not exceed 255 characters")
        .trim(),
    description: zod_1.z.string().trim().optional().nullable(),
    provinceId: zod_1.z.string().uuid("Invalid province ID format").optional().nullable(),
    districtId: zod_1.z.string().uuid("Invalid district ID format").optional().nullable(),
    villageId: zod_1.z.string().uuid("Invalid village ID format").optional().nullable(),
    location: zod_1.z.string().min(1, "Location is required").trim(),
    image: zod_1.z.string().trim().optional().nullable(),
    video: zod_1.z.string().trim().optional().nullable(),
    attachments: zod_1.z.any().optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.ReportStatus).optional(),
    currentAssignee: zod_1.z.nativeEnum(client_1.UserType).optional(),
});
// Report Update Schema
exports.reportUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must not exceed 255 characters")
        .trim()
        .optional(),
    description: zod_1.z.string().trim().optional().nullable(),
    provinceId: zod_1.z.string().uuid("Invalid province ID format").optional().nullable(),
    districtId: zod_1.z.string().uuid("Invalid district ID format").optional().nullable(),
    villageId: zod_1.z.string().uuid("Invalid village ID format").optional().nullable(),
    location: zod_1.z.string().min(1, "Location is required").trim().optional(),
    image: zod_1.z.string().trim().optional().nullable(),
    video: zod_1.z.string().trim().optional().nullable(),
    attachments: zod_1.z.any().optional().nullable(),
    status: zod_1.z.nativeEnum(client_1.ReportStatus).optional(),
    currentAssignee: zod_1.z.nativeEnum(client_1.UserType).optional(),
});
// Report Query/Filtering Schema
exports.reportQuerySchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.ReportStatus).optional(),
    currentAssignee: zod_1.z.nativeEnum(client_1.UserType).optional(),
    // Reports whose escalation history ever reached this level
    reachedAssignee: zod_1.z.nativeEnum(client_1.UserType).optional(),
    provinceId: zod_1.z.string().uuid().optional(),
    districtId: zod_1.z.string().uuid().optional(),
    villageId: zod_1.z.string().uuid().optional(),
    userId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
});
