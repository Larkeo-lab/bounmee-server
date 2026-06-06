"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryZoneSchema = exports.queryTableSchema = exports.tableParamsSchema = exports.updateTableSchema = exports.createTableSchema = exports.updateZoneSchema = exports.createZoneSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createZoneSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Zone name is required"),
    description: zod_1.z.string().optional(),
    storeId: zod_1.z.string().uuid("Invalid store ID"),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateZoneSchema = exports.createZoneSchema.partial();
exports.createTableSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Table name is required"),
    qrCode: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    capacity: zod_1.z.number().int().min(1).optional(),
    storeId: zod_1.z.string().uuid("Invalid store ID"),
    zoneId: zod_1.z.string().uuid("Invalid zone ID").optional(),
    isActive: zod_1.z.boolean().optional(),
    status: zod_1.z.nativeEnum(client_1.TableStatus).optional(),
});
exports.updateTableSchema = exports.createTableSchema.partial();
exports.tableParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid ID"),
});
exports.queryTableSchema = zod_1.z.object({
    storeId: zod_1.z.string().uuid("Invalid store ID").optional(),
    zoneId: zod_1.z.string().uuid("Invalid zone ID").optional(),
    isActive: zod_1.z
        .enum(["true", "false"])
        .optional()
        .transform((val) => val === "true" ? true : val === "false" ? false : undefined),
    status: zod_1.z.nativeEnum(client_1.TableStatus).optional(),
    search: zod_1.z.string().optional(),
});
exports.queryZoneSchema = zod_1.z.object({
    storeId: zod_1.z.string().uuid("Invalid store ID").optional(),
    isActive: zod_1.z
        .enum(["true", "false"])
        .optional()
        .transform((val) => val === "true" ? true : val === "false" ? false : undefined),
    search: zod_1.z.string().optional(),
});
