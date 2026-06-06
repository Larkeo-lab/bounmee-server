"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBankService = exports.updateBankService = exports.getBankByIdService = exports.getBanksService = exports.createBankService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createBankService = async (data) => {
    const result = await prisma_1.prisma.bank.create({
        data,
    });
    return result;
};
exports.createBankService = createBankService;
const getBanksService = async (storeId) => {
    const result = await prisma_1.prisma.bank.findMany({
        where: {
            ...(storeId ? { storeId } : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
exports.getBanksService = getBanksService;
const getBankByIdService = async (id) => {
    const result = await prisma_1.prisma.bank.findUnique({
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
exports.getBankByIdService = getBankByIdService;
const updateBankService = async (id, data) => {
    const existingBank = await prisma_1.prisma.bank.findUnique({ where: { id } });
    if (!existingBank) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const result = await prisma_1.prisma.bank.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateBankService = updateBankService;
const deleteBankService = async (id) => {
    const existingBank = await prisma_1.prisma.bank.findUnique({ where: { id } });
    if (!existingBank) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.bank.delete({ where: { id } });
    return { id, message: "Bank deleted successfully" };
};
exports.deleteBankService = deleteBankService;
