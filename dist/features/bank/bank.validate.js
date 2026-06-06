"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBanksQuerySchema = exports.bankParamsSchema = exports.updateBankSchema = exports.createBankSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBankSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Bank name is required"),
    logoUrl: zod_1.default.string().optional(),
    qrCodeImage: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional(),
    storeId: zod_1.default.string().uuid("Invalid store ID"),
});
exports.updateBankSchema = exports.createBankSchema.partial();
exports.bankParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid bank ID"),
});
exports.getBanksQuerySchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
});
