"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const citizen_validate_1 = require("./citizen.validate");
const response_format_1 = require("../../shared/utils/response-format");
const citizen_service_1 = require("./citizen.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const citizenController = {
    getAllCitizens,
    getCitizenById,
    updateCitizen,
    deleteCitizen,
};
async function getAllCitizens(req, res) {
    const { page, limit = 100 } = common_validate_1.paginationSchema.parse(req.query);
    const result = await (0, citizen_service_1.getAllCitizensService)(page, limit);
    const { citizens, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, citizens, page, limit, total);
}
async function getCitizenById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, citizen_service_1.getCitizenByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateCitizen(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = citizen_validate_1.citizenUpdateSchema.parse(req.body);
    const result = await (0, citizen_service_1.updateCitizenService)(id, validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteCitizen(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, citizen_service_1.deleteCitizenService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = citizenController;
