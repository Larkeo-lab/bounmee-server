"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const bank_validate_1 = require("./bank.validate");
const bank_service_1 = require("./bank.service");
exports.bankController = {
    createBank,
    getBanks,
    getBankById,
    updateBank,
    deleteBank,
};
async function createBank(req, res) {
    const data = bank_validate_1.createBankSchema.parse(req.body);
    const result = await (0, bank_service_1.createBankService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getBanks(req, res) {
    const { storeId } = bank_validate_1.getBanksQuerySchema.parse(req.query);
    const result = await (0, bank_service_1.getBanksService)(storeId);
    // Using ResponsePaginationSuccess for consistency, even if not fully paginated yet
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, 10, result.length);
}
async function getBankById(req, res) {
    const { id } = bank_validate_1.bankParamsSchema.parse(req.params);
    const result = await (0, bank_service_1.getBankByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateBank(req, res) {
    const { id } = bank_validate_1.bankParamsSchema.parse(req.params);
    const data = bank_validate_1.updateBankSchema.parse(req.body);
    const result = await (0, bank_service_1.updateBankService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteBank(req, res) {
    const { id } = bank_validate_1.bankParamsSchema.parse(req.params);
    const result = await (0, bank_service_1.deleteBankService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
