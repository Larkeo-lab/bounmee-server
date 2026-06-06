"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProductUpdateHistory = exports.UpdateProductUpdateHistorySchema = exports.CreateProductUpdateHistorySchema = void 0;
const zod_1 = require("zod");
exports.CreateProductUpdateHistorySchema = zod_1.z.object({
    oldStockQty: zod_1.z.number().int().optional().nullable(),
    newStockQty: zod_1.z.number().int().optional().nullable(),
    oldCost: zod_1.z.number().min(0, "Old cost must be non-negative"),
    newCost: zod_1.z.number().min(0, "New cost must be non-negative"),
    oldPrice: zod_1.z.number().min(0, "Old price must be non-negative"),
    newPrice: zod_1.z.number().min(0, "New price must be non-negative"),
    productId: zod_1.z.string().uuid("Invalid product ID"),
    updatedBy: zod_1.z.string().optional().nullable(),
});
exports.UpdateProductUpdateHistorySchema = zod_1.z.object({
    oldStockQty: zod_1.z.number().int().optional().nullable(),
    newStockQty: zod_1.z.number().int().optional().nullable(),
    oldCost: zod_1.z.number().min(0, "Old cost must be non-negative").optional(),
    newCost: zod_1.z.number().min(0, "New cost must be non-negative").optional(),
    oldPrice: zod_1.z.number().min(0, "Old price must be non-negative").optional(),
    newPrice: zod_1.z.number().min(0, "New price must be non-negative").optional(),
    productId: zod_1.z.string().uuid("Invalid product ID").optional(),
    updatedBy: zod_1.z.string().optional().nullable(),
});
exports.queryProductUpdateHistory = zod_1.z.object({
    productId: zod_1.z.string().optional(),
    storeId: zod_1.z.string().optional(),
});
