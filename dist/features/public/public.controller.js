"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const public_service_1 = require("./public.service");
const zod_1 = __importDefault(require("zod"));
const QrSchema = zod_1.default.object({ qrCode: zod_1.default.string() });
const StoreSchema = zod_1.default.object({ storeId: zod_1.default.string().uuid() });
const OrderSchema = zod_1.default.object({
    tableId: zod_1.default.string(),
    storeId: zod_1.default.string(),
    items: zod_1.default.array(zod_1.default
        .object({
        id: zod_1.default.string(),
        name: zod_1.default.string(),
        price: zod_1.default.coerce.number(),
        quantity: zod_1.default.coerce.number(),
        image: zod_1.default.string().nullable().optional(),
        stockQty: zod_1.default.coerce.number(),
        status: zod_1.default.string().optional(),
        note: zod_1.default.string().nullable().optional(),
    })
        .passthrough()),
});
async function getTableByQr(req, res) {
    try {
        const { qrCode } = QrSchema.parse(req.params);
        const result = await public_service_1.PublicService.getTableByQrCode(qrCode);
        (0, response_format_1.ResponseSuccess)(res, result);
    }
    catch (error) {
        console.error(`[PublicController] getTableByQr Error for QR: ${req.params.qrCode}`, error.message || error);
        throw error;
    }
}
async function getPublicProducts(req, res) {
    try {
        const { storeId } = StoreSchema.parse(req.params);
        const categoryId = req.query.categoryId;
        const result = await public_service_1.PublicService.getProducts(storeId, categoryId);
        (0, response_format_1.ResponseManyDataSuccess)(res, result.data);
    }
    catch (error) {
        console.error(`[PublicController] getPublicProducts Error for Store: ${req.params.storeId}`, error.message || error);
        throw error;
    }
}
async function submitCustomerOrder(req, res) {
    console.log("Incoming order body:", JSON.stringify(req.body, null, 2));
    try {
        const data = OrderSchema.parse(req.body);
        const result = await public_service_1.PublicService.submitOrder(data);
        (0, response_format_1.ResponseSuccess)(res, result);
    }
    catch (error) {
        console.error("[PublicController] submitCustomerOrder Error:", error.message || error);
        throw error;
    }
}
exports.PublicController = {
    getTableByQr,
    getPublicProducts,
    submitCustomerOrder,
};
