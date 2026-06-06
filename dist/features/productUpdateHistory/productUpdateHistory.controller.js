"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateHistoryController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const productUpdateHistory_validate_1 = require("./productUpdateHistory.validate");
const productUpdateHistory_service_1 = require("./productUpdateHistory.service");
const common_validate_1 = require("../../shared/validations/common.validate");
exports.productUpdateHistoryController = {
    createProductUpdateHistory,
    getProductUpdateHistories,
    getProductUpdateHistoryById,
    updateProductUpdateHistory,
    deleteProductUpdateHistory,
};
async function createProductUpdateHistory(req, res) {
    const data = productUpdateHistory_validate_1.CreateProductUpdateHistorySchema.parse(req.body);
    const result = await (0, productUpdateHistory_service_1.createProductUpdateHistoryService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getProductUpdateHistories(req, res) {
    const { productId, storeId } = productUpdateHistory_validate_1.queryProductUpdateHistory.parse(req.query);
    const { page, limit, search, startDate, endDate } = common_validate_1.paginationSchema.parse(req.query);
    const { data, total } = await (0, productUpdateHistory_service_1.getProductUpdateHistoriesService)(productId, storeId, page, limit, search, startDate, endDate);
    (0, response_format_1.ResponsePaginationSuccess)(res, data, page, limit, total);
}
async function getProductUpdateHistoryById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, productUpdateHistory_service_1.getProductUpdateHistoryByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateProductUpdateHistory(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const data = productUpdateHistory_validate_1.UpdateProductUpdateHistorySchema.parse(req.body);
    const result = await (0, productUpdateHistory_service_1.updateProductUpdateHistoryService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteProductUpdateHistory(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, productUpdateHistory_service_1.deleteProductUpdateHistoryService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
