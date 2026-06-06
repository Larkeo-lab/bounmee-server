"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const unit_validate_1 = require("./unit.validate");
const unit_service_1 = require("./unit.service");
exports.unitController = {
    createUnit,
    getUnits,
    getUnitById,
    updateUnit,
    deleteUnit,
};
async function createUnit(req, res) {
    const data = unit_validate_1.CreateUnitSchema.parse(req.body);
    const result = await (0, unit_service_1.createUnitService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getUnits(req, res) {
    const { storeId, productId } = req.query;
    const result = await (0, unit_service_1.getUnitsService)(storeId, productId);
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, result.length, result.length);
}
async function getUnitById(req, res) {
    const { id } = req.params;
    const result = await (0, unit_service_1.getUnitByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateUnit(req, res) {
    const { id } = req.params;
    const data = unit_validate_1.UpdateUnitSchema.parse(req.body);
    const result = await (0, unit_service_1.updateUnitService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteUnit(req, res) {
    const { id } = req.params;
    const result = await (0, unit_service_1.deleteUnitService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
