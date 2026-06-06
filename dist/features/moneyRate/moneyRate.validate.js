"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoneyRatesQuerySchema = exports.moneyRateParamsSchema = exports.updateMoneyRateSchema = exports.createMoneyRateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createMoneyRateSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    rateSell: zod_1.default.number().or(zod_1.default.string().transform((val) => Number(val))),
    rateBuy: zod_1.default.number().or(zod_1.default.string().transform((val) => Number(val))),
    storeId: zod_1.default.string().uuid("Invalid store ID"),
});
exports.updateMoneyRateSchema = exports.createMoneyRateSchema.partial();
exports.moneyRateParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid money rate ID"),
});
exports.getMoneyRatesQuerySchema = zod_1.default.object({
    storeId: zod_1.default.string().uuid("Invalid store ID").optional(),
});
