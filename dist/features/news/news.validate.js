"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.newsUpdateSchema = exports.newsCreateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// News Creation Schema
exports.newsCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must not exceed 255 characters")
        .trim(),
    content: zod_1.z
        .string()
        .min(1, "Content is required")
        .trim(),
    image: zod_1.z
        .string()
        .max(255, "Image URL must not exceed 255 characters")
        .trim(),
    status: zod_1.z.nativeEnum(client_1.NewsStatus).optional(),
});
// News Update Schema
exports.newsUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must not exceed 255 characters")
        .trim()
        .optional(),
    content: zod_1.z
        .string()
        .min(1, "Content is required")
        .trim()
        .optional(),
    image: zod_1.z
        .string()
        .max(255, "Image URL must not exceed 255 characters")
        .trim()
        .optional(),
    status: zod_1.z.nativeEnum(client_1.NewsStatus).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.querySchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.NewsStatus).optional(),
    search: zod_1.z.string().optional(),
    createdBy: zod_1.z.string().optional(),
    isActive: zod_1.z.preprocess((val) => (val === "true" ? true : val === "false" ? false : val), zod_1.z.boolean().optional()),
});
