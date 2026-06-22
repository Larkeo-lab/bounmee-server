"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const village_chief_validate_1 = require("./village-chief.validate");
const response_format_1 = require("../../shared/utils/response-format");
const village_chief_service_1 = require("./village-chief.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const villageChiefController = {
    createVillageChief,
    getAllVillageChiefs,
    getVillageChiefById,
    updateVillageChief,
    deleteVillageChief,
};
async function createVillageChief(req, res) {
    const validatedData = village_chief_validate_1.villageChiefCreateSchema.parse(req.body);
    const createdBy = res.locals.payload?.userId || "system";
    const result = await (0, village_chief_service_1.createVillageChiefService)(validatedData, createdBy);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getAllVillageChiefs(req, res) {
    const { page, limit = 100 } = common_validate_1.paginationSchema.parse(req.query);
    const result = await (0, village_chief_service_1.getAllVillageChiefsService)(page, limit);
    const { villageChiefs, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, villageChiefs, page, limit, total);
}
async function getVillageChiefById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, village_chief_service_1.getVillageChiefByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateVillageChief(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = village_chief_validate_1.villageChiefUpdateSchema.parse(req.body);
    const updatedBy = res.locals.payload?.userId || "system";
    const result = await (0, village_chief_service_1.updateVillageChiefService)(id, validatedData, updatedBy);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteVillageChief(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, village_chief_service_1.deleteVillageChiefService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = villageChiefController;
