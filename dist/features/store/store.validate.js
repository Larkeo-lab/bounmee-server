"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryStore = exports.storeParamsSchema = exports.updateStoreSchema = exports.createStoreSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createStoreSchema = zod_1.default.object({
    // Store info
    name: zod_1.default.string().min(1, "Store name is required"),
    address: zod_1.default.string().optional(),
    logoUrl: zod_1.default.string().optional(),
    type: zod_1.default.nativeEnum(client_1.StoreType).optional(),
    bussinessType: zod_1.default.nativeEnum(client_1.BussinessType).optional(),
    // User info
    email: zod_1.default.string().email("Invalid email"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    phone: zod_1.default.string().min(9, "Phone number is required"),
    language: zod_1.default.nativeEnum(client_1.Language).default(client_1.Language.LA).optional(),
    status: zod_1.default.nativeEnum(client_1.Status).optional(),
    provinceId: zod_1.default.string().uuid().optional(),
    districtId: zod_1.default.string().uuid().optional(),
    staffSaleId: zod_1.default.string().uuid().optional(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
    isActive: zod_1.default.boolean().optional(),
});
exports.updateStoreSchema = exports.createStoreSchema.partial().extend({
    // ตอนอัปเดต: เบอร์โทรมีก็ได้ ไม่มีก็ได้ (รับค่าว่างได้ด้วย)
    phone: zod_1.default
        .string()
        .min(9, "Phone number is required")
        .or(zod_1.default.literal(""))
        .optional(),
});
exports.storeParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid store ID"),
});
exports.queryStore = zod_1.default.object({
    storeId: zod_1.default.string().uuid().optional(),
    provinceId: zod_1.default.string().uuid().optional(),
    districtId: zod_1.default.string().uuid().optional(),
    status: zod_1.default.nativeEnum(client_1.Status).optional(),
    type: zod_1.default.nativeEnum(client_1.StoreType).optional(),
    bussinessType: zod_1.default.nativeEnum(client_1.BussinessType).optional(),
    staffSaleId: zod_1.default.string().uuid().optional(),
    startDate: zod_1.default.coerce.date().optional(),
    endDate: zod_1.default.coerce.date().optional(),
});
