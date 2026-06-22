"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const police_district_validate_1 = require("./police-district.validate");
const response_format_1 = require("../../shared/utils/response-format");
const police_district_service_1 = require("./police-district.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const policeDistrictController = {
    createPoliceDistrict,
    getAllPoliceDistricts,
    getPoliceDistrictById,
    updatePoliceDistrict,
    deletePoliceDistrict,
    policeDistrictAndReportList,
};
async function createPoliceDistrict(req, res) {
    const validatedData = police_district_validate_1.policeDistrictCreateSchema.parse(req.body);
    const createdBy = res.locals.payload?.userId || "system";
    const result = await (0, police_district_service_1.createPoliceDistrictService)(validatedData, createdBy);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getAllPoliceDistricts(req, res) {
    const { page, limit = 100 } = common_validate_1.paginationSchema.parse(req.query);
    const result = await (0, police_district_service_1.getAllPoliceDistrictsService)(page, limit);
    const { policeDistricts, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, policeDistricts, page, limit, total);
}
async function getPoliceDistrictById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, police_district_service_1.getPoliceDistrictByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updatePoliceDistrict(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = police_district_validate_1.policeDistrictUpdateSchema.parse(req.body);
    const updatedBy = res.locals.payload?.userId || "system";
    const result = await (0, police_district_service_1.updatePoliceDistrictService)(id, validatedData, updatedBy);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deletePoliceDistrict(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, police_district_service_1.deletePoliceDistrictService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function policeDistrictAndReportList(req, res) {
    const userId = res.locals.payload?.userId;
    const result = await (0, police_district_service_1.getAllPoliceDistrictsAndReportService)(userId);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = policeDistrictController;
