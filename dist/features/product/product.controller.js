"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const product_validate_1 = require("./product.validate");
const server_1 = require("../../server");
const product_service_1 = require("./product.service");
exports.productController = {
    createProduct,
    getProducts,
    getProductByBarcode,
    getProductById,
    updateProduct,
    deleteProduct,
};
// --- Product Controllers ---
async function createProduct(req, res) {
    const data = product_validate_1.createProductSchema.parse(req.body);
    const result = await (0, product_service_1.createProductService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getProducts(req, res) {
    const data = product_validate_1.getProductsQuerySchema.parse(req.query);
    const result = await (0, product_service_1.getProductsService)(data);
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, result.length, result.length);
}
async function getProductByBarcode(req, res) {
    const { barcode } = req.params;
    const { storeId, userId } = req.query; // Assume storeId and userId are passed in query
    const result = await (0, product_service_1.getProductByBarcodeService)(barcode, storeId);
    // Emit to socket.io to the specific user's room
    if (server_1.io && userId) {
        server_1.io.to(`user-${userId}`).emit("PRODUCT:SCANNED", result);
    }
    else if (server_1.io && storeId) {
        // Fallback to store room if userId is not provided
        server_1.io.to(`store-${storeId}`).emit("PRODUCT:SCANNED", result);
    }
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getProductById(req, res) {
    const { id } = product_validate_1.productParamsSchema.parse(req.params);
    const result = await (0, product_service_1.getProductByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateProduct(req, res) {
    const { id } = product_validate_1.productParamsSchema.parse(req.params);
    const data = product_validate_1.updateProductSchema.parse(req.body);
    const result = await (0, product_service_1.updateProductService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteProduct(req, res) {
    const { id } = product_validate_1.productParamsSchema.parse(req.params);
    const result = await (0, product_service_1.deleteProductService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
