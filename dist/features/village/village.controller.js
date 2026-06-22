"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_format_1 = require("../../shared/utils/response-format");
const village_service_1 = require("./village.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const village_validate_1 = require("./village.validate");
const villageController = {
    getAllVillages,
    getVillageById,
    updateVillage,
    deleteVillage,
};
async function getAllVillages(req, res) {
    const { page, limit } = common_validate_1.paginationSchema.parse(req.query);
    const { districtCode, provinceCode } = village_validate_1.querySchema.parse(req.query);
    const result = await (0, village_service_1.getAllVillagesService)(page, limit, districtCode, provinceCode);
    const { villages, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, villages, page, limit, total);
}
async function getVillageById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, village_service_1.getVillageByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateVillage(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = village_validate_1.villageUpdateSchema.parse(req.body);
    const result = await (0, village_service_1.updateVillageService)(id, validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteVillage(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, village_service_1.deleteVillageService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = villageController;
