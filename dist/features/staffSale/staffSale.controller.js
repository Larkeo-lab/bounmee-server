"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSaleController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const staffSale_validate_1 = require("./staffSale.validate");
const staffSale_service_1 = require("./staffSale.service");
const common_validate_1 = require("../../shared/validations/common.validate");
exports.staffSaleController = {
    getStaffSales,
    getStaffSaleById,
    createStaffSale,
    updateStaffSale,
    deleteStaffSale,
};
async function getStaffSales(req, res) {
    const { page, limit, search } = common_validate_1.paginationSchema.parse(req.query);
    const { data, total } = await (0, staffSale_service_1.getStaffSalesService)(search, page, limit);
    (0, response_format_1.ResponsePaginationSuccess)(res, data, page, limit, total);
}
async function getStaffSaleById(req, res) {
    const { id } = staffSale_validate_1.staffSaleParamsSchema.parse(req.params);
    const result = await (0, staffSale_service_1.getStaffSaleByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function createStaffSale(req, res) {
    const data = staffSale_validate_1.createStaffSaleSchema.parse(req.body);
    const result = await (0, staffSale_service_1.createStaffSaleService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function updateStaffSale(req, res) {
    const { id } = staffSale_validate_1.staffSaleParamsSchema.parse(req.params);
    const data = staffSale_validate_1.updateStaffSaleSchema.parse(req.body);
    const result = await (0, staffSale_service_1.updateStaffSaleService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteStaffSale(req, res) {
    const { id } = staffSale_validate_1.staffSaleParamsSchema.parse(req.params);
    const result = await (0, staffSale_service_1.deleteStaffSaleService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
