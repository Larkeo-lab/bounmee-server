"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_validate_1 = require("../../shared/validations/common.validate");
const response_format_1 = require("../../shared/utils/response-format");
const district_service_1 = require("./district.service");
const district_validate_1 = require("./district.validate");
const districtController = {
    // createDistrict,
    getAllDistricts,
    getDistrictById,
    updateDistrict,
    deleteDistrict,
};
// async function createDistrict(req: Request, res: Response) {
//   const validatedData = districtCreateSchema.parse(req.body);
//   const result = await createDistrictService(validatedData, "admin");
//   ResponseSuccess(res, result);
// }
async function getAllDistricts(req, res) {
    const { page, limit } = common_validate_1.paginationSchema.parse(req.query);
    const { provinceCode } = district_validate_1.querySchema.parse(req.query);
    const result = await (0, district_service_1.getAllDistrictsService)(page, limit, provinceCode);
    const { districts, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, districts, page, limit, total);
}
async function getDistrictById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, district_service_1.getDistrictByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateDistrict(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = district_validate_1.districtUpdateSchema.parse(req.body);
    const result = await (0, district_service_1.updateDistrictService)(id, validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteDistrict(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, district_service_1.deleteDistrictService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = districtController;
