"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeSchema = exports.idSchema = exports.paginationSchema = void 0;
const zod_1 = require("zod");
// Pagination Schema - reusable for all list endpoints
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const num = val ? Number.parseInt(val, 10) : 1;
        return Number.isNaN(num) || num < 1 ? 1 : num;
    }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        const num = val ? Number.parseInt(val, 10) : 10;
        if (Number.isNaN(num) || num < 1)
            return 10;
        return num > 100 ? 100 : num;
    }),
    search: zod_1.z.string().optional(),
    startDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    endDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    isActive: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true" ? true : val === "false" ? false : undefined),
});
exports.idSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .uuid("Invalid UUID format")
        .transform((val) => {
        if (!val)
            throw new Error("ID is required");
        return val;
    }),
});
exports.storeSchema = zod_1.z.object({
    storeId: zod_1.z.string().uuid("Invalid UUID format"),
});
