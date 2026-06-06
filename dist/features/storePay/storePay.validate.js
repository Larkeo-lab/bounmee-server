"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorePaysQuerySchema = exports.storePayParamsSchema = exports.updateStorePaySchema = exports.createStorePaySchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createStorePaySchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID"),
    amount: zod_1.default.number().positive("Amount must be positive"),
    transferAmount: zod_1.default.number().min(0).optional().nullable(),
    cashAmount: zod_1.default.number().min(0).optional().nullable(),
    paymentDate: zod_1.default.preprocess((val) => (typeof val === "string" ? new Date(val) : val), zod_1.default.date()),
    paymentMethod: zod_1.default.nativeEnum(client_1.PaymentMethod).optional(),
    image: zod_1.default.string().optional().nullable(),
    note: zod_1.default.string().optional().nullable(),
    status: zod_1.default.nativeEnum(client_1.StorePayStatus).optional(),
});
exports.updateStorePaySchema = exports.createStorePaySchema.partial();
exports.storePayParamsSchema = zod_1.default.object({
    id: zod_1.default.string(),
});
exports.getStorePaysQuerySchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
    status: zod_1.default.nativeEnum(client_1.StorePayStatus).optional(),
});
