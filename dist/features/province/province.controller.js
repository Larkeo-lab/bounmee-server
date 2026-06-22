"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const province_validate_1 = require("./province.validate");
const response_format_1 = require("../../shared/utils/response-format");
const province_service_1 = require("./province.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const provinceController = {
    createProvince,
    getAllProvinces,
    getProvinceById,
    updateProvince,
    deleteProvince,
};
async function createProvince(req, res) {
    const validatedData = province_validate_1.provinceCreateSchema.parse(req.body);
    const result = await (0, province_service_1.createProvinceService)(validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getAllProvinces(req, res) {
    const { page, limit = 100 } = common_validate_1.paginationSchema.parse(req.query);
    const result = await (0, province_service_1.getAllProvincesService)(page, limit);
    const { provinces, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, provinces, page, limit, total);
}
async function getProvinceById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, province_service_1.getProvinceByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateProvince(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = province_validate_1.provinceUpdateSchema.parse(req.body);
    const result = await (0, province_service_1.updateProvinceService)(id, validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteProvince(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, province_service_1.deleteProvinceService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = provinceController;
