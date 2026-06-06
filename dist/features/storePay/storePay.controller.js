"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePayController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const storePay_validate_1 = require("./storePay.validate");
const storePay_service_1 = require("./storePay.service");
const common_validate_1 = require("../../shared/validations/common.validate");
exports.storePayController = {
    createStorePay,
    getStorePays,
    getStorePayById,
    updateStorePay,
    deleteStorePay,
};
async function createStorePay(req, res) {
    const data = storePay_validate_1.createStorePaySchema.parse(req.body);
    const result = await (0, storePay_service_1.createStorePayService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getStorePays(req, res) {
    const { storeId, status } = storePay_validate_1.getStorePaysQuerySchema.parse(req.query);
    const { page, limit, startDate, endDate } = common_validate_1.paginationSchema.parse(req.query);
    const { data, total } = await (0, storePay_service_1.getStorePaysService)(storeId, status, startDate, endDate, page, limit);
    (0, response_format_1.ResponsePaginationSuccess)(res, data, page, limit, total);
}
async function getStorePayById(req, res) {
    const { id } = storePay_validate_1.storePayParamsSchema.parse(req.params);
    const result = await (0, storePay_service_1.getStorePayByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateStorePay(req, res) {
    const { id } = storePay_validate_1.storePayParamsSchema.parse(req.params);
    const data = storePay_validate_1.updateStorePaySchema.parse(req.body);
    const result = await (0, storePay_service_1.updateStorePayService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteStorePay(req, res) {
    const { id } = storePay_validate_1.storePayParamsSchema.parse(req.params);
    const result = await (0, storePay_service_1.deleteStorePayService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
