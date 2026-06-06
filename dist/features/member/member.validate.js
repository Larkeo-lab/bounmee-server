"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembersQuerySchema = exports.memberParamsSchema = exports.updateMemberSchema = exports.createMemberSchema = void 0;
const zod_1 = require("zod");
exports.createMemberSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    phone: zod_1.z.string().min(1).max(20),
    points: zod_1.z.number().int().nonnegative().optional().default(0),
    storeId: zod_1.z.string().uuid().optional().nullable(),
});
exports.updateMemberSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    phone: zod_1.z.string().min(1).max(20).optional(),
    points: zod_1.z.number().int().nonnegative().optional(),
    storeId: zod_1.z.string().uuid().optional().nullable(),
});
exports.memberParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.getMembersQuerySchema = zod_1.z.object({
    storeId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
