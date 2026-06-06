"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderItemsSchema = exports.updateOrderPaymentStatusSchema = exports.orderParamsSchema = exports.queryOrderSchema = exports.createOrderSchema = exports.documentItemSchema = exports.productFreeItemSchema = exports.createOrderItemSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createOrderItemSchema = zod_1.default.object({
    productId: zod_1.default.string().uuid("Invalid product ID"),
    qty: zod_1.default.number().int().min(1, "Quantity must be at least 1"),
    unitPrice: zod_1.default.number().min(0, "Unit price must be non-negative"),
    subTotal: zod_1.default.number().min(0, "Subtotal must be non-negative"),
    status: zod_1.default.nativeEnum(client_1.ProductStatus).optional(),
    note: zod_1.default.string().optional(),
    unitName: zod_1.default.string().optional(),
});
// ✨ ของแถม (Free product) per order
exports.productFreeItemSchema = zod_1.default.object({
    productId: zod_1.default.string().uuid("Invalid product ID"),
    amount: zod_1.default.number().int().min(1, "Amount must be at least 1"),
    price: zod_1.default.number().min(0, "Price must be non-negative"),
    totalPrice: zod_1.default.number().min(0, "Total price must be non-negative"),
});
// ✨ เอกสารแนบ (dynamic) per order
exports.documentItemSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Document name is required"),
    imageUrl: zod_1.default.string().optional().nullable(),
    description: zod_1.default.string().optional().nullable(),
});
exports.createOrderSchema = zod_1.default.object({
    totalAmount: zod_1.default.number().min(0, "Total amount must be non-negative"),
    receivedAmount: zod_1.default.number().min(0, "Received amount must be non-negative"),
    change: zod_1.default.number().min(0, "Change must be non-negative"),
    paymentMethod: zod_1.default.nativeEnum(client_1.PaymentMethod),
    storeId: zod_1.default.string().uuid("Invalid store ID"),
    employeeId: zod_1.default.string().uuid("Invalid employee ID").optional().nullable(),
    memberId: zod_1.default.string().uuid("Invalid member ID").optional(),
    bankId: zod_1.default.string().uuid("Invalid bank ID").optional().nullable(),
    items: zod_1.default
        .array(exports.createOrderItemSchema)
        .min(1, "Order must have at least one item"),
    tableId: zod_1.default.string().uuid("Invalid table ID").optional(),
    zoneId: zod_1.default.string().uuid("Invalid zone ID").optional(),
    documents: zod_1.default.array(exports.documentItemSchema).optional(),
    transferSlip: zod_1.default.string().optional().nullable(),
    businessType: zod_1.default.nativeEnum(client_1.BusinessType).optional(),
    discountAmount: zod_1.default
        .number()
        .min(0, "Discount amount must be non-negative")
        .optional()
        .nullable(),
    isDiscount: zod_1.default.boolean().optional().nullable(),
    discountPercent: zod_1.default
        .number()
        .min(0, "Discount percent must be non-negative")
        .optional()
        .nullable(),
    isDebt: zod_1.default.boolean().optional().nullable(),
    debtAmount: zod_1.default.number().optional().nullable(),
    transferAmount: zod_1.default.number().optional().nullable(),
    cashAmount: zod_1.default.number().optional().nullable(),
    creditCardAmount: zod_1.default.number().optional().nullable(),
    dueDate: zod_1.default.string().datetime().optional().nullable(),
    paymentStatus: zod_1.default.nativeEnum(client_1.PaymentStatus).optional(),
    productFrees: zod_1.default.array(exports.productFreeItemSchema).optional(),
});
exports.queryOrderSchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
    employeeId: zod_1.default.string().uuid("Invalid employee ID").optional(),
    memberId: zod_1.default.string().uuid("Invalid member ID").optional(),
    tableId: zod_1.default.string().uuid("Invalid table ID").optional(),
    businessType: zod_1.default.nativeEnum(client_1.BusinessType).optional(),
    isDiscount: zod_1.default
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    isDebt: zod_1.default
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
});
exports.orderParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid order ID"),
});
exports.updateOrderPaymentStatusSchema = zod_1.default.object({
    paymentStatus: zod_1.default.nativeEnum(client_1.PaymentStatus),
    receivedAmount: zod_1.default.number().min(0).optional(),
    paymentMethod: zod_1.default.nativeEnum(client_1.PaymentMethod).optional(),
    bankId: zod_1.default.string().uuid().optional().nullable(),
    note: zod_1.default.string().optional().nullable(),
});
exports.updateOrderItemsSchema = zod_1.default.object({
    items: zod_1.default
        .array(exports.createOrderItemSchema)
        .min(1, "Order must have at least one item"),
    totalAmount: zod_1.default.number().min(0, "Total amount must be non-negative"),
    discountAmount: zod_1.default.number().min(0).optional().nullable(),
    isDiscount: zod_1.default.boolean().optional().nullable(),
    discountPercent: zod_1.default.number().min(0).optional().nullable(),
    // Payment fields (re-collected through PaymentModal on edit)
    receivedAmount: zod_1.default.number().min(0).optional(),
    change: zod_1.default.number().min(0).optional(),
    paymentMethod: zod_1.default.nativeEnum(client_1.PaymentMethod).optional(),
    cashAmount: zod_1.default.number().min(0).optional().nullable(),
    transferAmount: zod_1.default.number().min(0).optional().nullable(),
    bankId: zod_1.default.string().uuid("Invalid bank ID").optional().nullable(),
    paymentStatus: zod_1.default.nativeEnum(client_1.PaymentStatus).optional(),
    isDebt: zod_1.default.boolean().optional().nullable(),
    debtAmount: zod_1.default.number().optional().nullable(),
    memberId: zod_1.default.string().uuid().optional().nullable(),
    documents: zod_1.default.array(exports.documentItemSchema).optional(),
    transferSlip: zod_1.default.string().optional().nullable(),
    dueDate: zod_1.default.string().datetime().optional().nullable(),
    productFrees: zod_1.default.array(exports.productFreeItemSchema).optional(),
});
