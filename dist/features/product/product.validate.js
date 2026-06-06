"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsQuerySchema = exports.productParamsSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
// ✨ Phone / Fix-related fields (shared between create + update)
const phoneFields = {
    fixPrice: zod_1.default.number().min(0).optional().nullable(),
    isFix: zod_1.default.boolean().optional(),
    fixDescription: zod_1.default.string().optional().nullable(),
    model: zod_1.default.string().optional().nullable(),
    storage: zod_1.default.string().optional().nullable(),
    buyDate: zod_1.default
        .union([zod_1.default.coerce.date(), zod_1.default.null()])
        .optional(),
    sellDate: zod_1.default
        .union([zod_1.default.coerce.date(), zod_1.default.null()])
        .optional(),
    color: zod_1.default.string().optional().nullable(),
    productType: zod_1.default.nativeEnum(client_1.ProductType).optional(),
};
// Product Validation
exports.createProductSchema = zod_1.default.object({
    barcode: zod_1.default
        .string()
        .optional()
        .nullable()
        .transform((val) => (val?.trim() === "" ? null : val)),
    name: zod_1.default.string().min(1, "Product name is required"),
    description: zod_1.default.string().optional(),
    cost: zod_1.default.number().min(0, "Cost must be non-negative"),
    price: zod_1.default.number().min(0, "Price must be non-negative"),
    stockQty: zod_1.default
        .number()
        .int()
        .min(0, "Stock quantity must be non-negative")
        .default(0),
    categoryId: zod_1.default.string().uuid("Invalid category ID"),
    unitId: zod_1.default
        .preprocess((val) => (val === "" ? null : val), zod_1.default.string().uuid("Invalid unit ID").nullable())
        .optional(),
    storeId: zod_1.default.string().uuid("Invalid store ID"),
    image: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional(),
    isBarcode: zod_1.default.boolean().optional(),
    businessType: zod_1.default.nativeEnum(client_1.BusinessType).optional(),
    ...phoneFields,
});
exports.updateProductSchema = zod_1.default.object({
    barcode: zod_1.default
        .string()
        .optional()
        .nullable()
        .transform((val) => (val?.trim() === "" ? null : val)),
    name: zod_1.default.string().min(1, "Product name is required").optional(),
    description: zod_1.default.string().optional(),
    cost: zod_1.default.number().min(0, "Cost must be non-negative").optional(),
    price: zod_1.default.number().min(0, "Price must be non-negative").optional(),
    stockQty: zod_1.default
        .number()
        .int()
        .min(0, "Stock quantity must be non-negative")
        .optional(),
    categoryId: zod_1.default.string().uuid("Invalid category ID").optional(),
    unitId: zod_1.default
        .preprocess((val) => (val === "" ? null : val), zod_1.default.string().uuid("Invalid unit ID").nullable())
        .optional(),
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
    image: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().optional(),
    isBarcode: zod_1.default.boolean().optional(),
    businessType: zod_1.default.nativeEnum(client_1.BusinessType).optional(),
    ...phoneFields,
});
exports.productParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid product ID"),
});
exports.getProductsQuerySchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
    categoryId: zod_1.default.string().uuid("Invalid category ID").optional(),
    isActive: zod_1.default
        .preprocess((val) => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        return val;
    }, zod_1.default.boolean())
        .optional(),
    search: zod_1.default.string().optional(),
    isFix: zod_1.default
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    productType: zod_1.default.nativeEnum(client_1.ProductType).optional(),
    // ✅ ลบ status และ tableId ออก → ย้ายไปอยู่ใน OrderItem แล้ว
});
