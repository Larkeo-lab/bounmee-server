"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMoneyRateService = exports.updateMoneyRateService = exports.getMoneyRateByIdService = exports.getMoneyRatesService = exports.createMoneyRateService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createMoneyRateService = async (data) => {
    const result = await prisma_1.prisma.moneyRate.create({
        data,
    });
    return result;
};
exports.createMoneyRateService = createMoneyRateService;
const getMoneyRatesService = async (query) => {
    const { storeId } = query;
    const result = await prisma_1.prisma.moneyRate.findMany({
        where: {
            ...(storeId ? { storeId } : {}),
        },
        include: {
            store: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
exports.getMoneyRatesService = getMoneyRatesService;
const getMoneyRateByIdService = async (id) => {
    const result = await prisma_1.prisma.moneyRate.findUnique({
        where: { id },
        include: {
            store: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getMoneyRateByIdService = getMoneyRateByIdService;
const updateMoneyRateService = async (id, data) => {
    const existingMoneyRate = await prisma_1.prisma.moneyRate.findUnique({
        where: { id },
    });
    if (!existingMoneyRate) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const result = await prisma_1.prisma.moneyRate.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateMoneyRateService = updateMoneyRateService;
const deleteMoneyRateService = async (id) => {
    const existingMoneyRate = await prisma_1.prisma.moneyRate.findUnique({
        where: { id },
    });
    if (!existingMoneyRate) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.moneyRate.delete({ where: { id } });
    return { id, message: "Money rate deleted successfully" };
};
exports.deleteMoneyRateService = deleteMoneyRateService;
