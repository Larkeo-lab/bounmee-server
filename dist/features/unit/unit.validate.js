"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUnitSchema = exports.CreateUnitSchema = void 0;
const zod_1 = require("zod");
exports.CreateUnitSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50),
    storeId: zod_1.z.string().uuid(),
    productId: zod_1.z.string().uuid().optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
exports.UpdateUnitSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50).optional(),
    isActive: zod_1.z.boolean().optional(),
});
