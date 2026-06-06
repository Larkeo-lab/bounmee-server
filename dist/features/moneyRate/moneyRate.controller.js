"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moneyRateController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const moneyRate_validate_1 = require("./moneyRate.validate");
const moneyRate_service_1 = require("./moneyRate.service");
exports.moneyRateController = {
    createMoneyRate,
    getMoneyRates,
    getMoneyRateById,
    updateMoneyRate,
    deleteMoneyRate,
};
async function createMoneyRate(req, res) {
    const data = moneyRate_validate_1.createMoneyRateSchema.parse(req.body);
    const result = await (0, moneyRate_service_1.createMoneyRateService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getMoneyRates(req, res) {
    const query = moneyRate_validate_1.getMoneyRatesQuerySchema.parse(req.query);
    const result = await (0, moneyRate_service_1.getMoneyRatesService)(query);
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, 10, result.length);
}
async function getMoneyRateById(req, res) {
    const { id } = moneyRate_validate_1.moneyRateParamsSchema.parse(req.params);
    const result = await (0, moneyRate_service_1.getMoneyRateByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateMoneyRate(req, res) {
    const { id } = moneyRate_validate_1.moneyRateParamsSchema.parse(req.params);
    const data = moneyRate_validate_1.updateMoneyRateSchema.parse(req.body);
    const result = await (0, moneyRate_service_1.updateMoneyRateService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteMoneyRate(req, res) {
    const { id } = moneyRate_validate_1.moneyRateParamsSchema.parse(req.params);
    const result = await (0, moneyRate_service_1.deleteMoneyRateService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
