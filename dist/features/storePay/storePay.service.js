"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStorePayService = exports.updateStorePayService = exports.getStorePayByIdService = exports.getStorePaysService = exports.createStorePayService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createStorePayService = async (data) => {
    const result = await prisma_1.prisma.storePay.create({
        data: {
            storeId: data.storeId,
            amount: data.amount,
            transferAmount: data.transferAmount,
            cashAmount: data.cashAmount,
            paymentDate: data.paymentDate,
            paymentMethod: data.paymentMethod,
            image: data.image,
            note: data.note,
            status: data.status,
        },
    });
    return result;
};
exports.createStorePayService = createStorePayService;
const getStorePaysService = async (storeId, status, startDate, endDate, page = 1, limit = 10) => {
    const where = {};
    if (storeId)
        where.storeId = storeId;
    if (status)
        where.status = status;
    if (startDate && endDate)
        where.paymentDate = { gte: startDate, lte: endDate };
    const result = await prisma_1.prisma.storePay.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    const summary = {
        totalAmount: result.reduce((acc, item) => acc + Number(item.amount), 0),
        totalCashAmount: result.reduce((acc, item) => acc + Number(item.cashAmount || 0), 0),
        totalBankAmount: result.reduce((acc, item) => acc + Number(item.transferAmount || 0), 0),
    };
    const total = await prisma_1.prisma.storePay.count({
        where,
    });
    return {
        data: {
            result,
            summary,
        },
        total,
    };
};
exports.getStorePaysService = getStorePaysService;
const getStorePayByIdService = async (id) => {
    const result = await prisma_1.prisma.storePay.findUnique({
        where: { id },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                },
            },
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getStorePayByIdService = getStorePayByIdService;
const updateStorePayService = async (id, data) => {
    const existingPay = await prisma_1.prisma.storePay.findUnique({ where: { id } });
    if (!existingPay) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const result = await prisma_1.prisma.storePay.update({
        where: { id },
        data: {
            amount: data.amount,
            transferAmount: data.transferAmount,
            cashAmount: data.cashAmount,
            paymentDate: data.paymentDate,
            paymentMethod: data.paymentMethod,
            image: data.image,
            note: data.note,
            status: data.status,
        },
    });
    return result;
};
exports.updateStorePayService = updateStorePayService;
const deleteStorePayService = async (id) => {
    const existingPay = await prisma_1.prisma.storePay.findUnique({ where: { id } });
    if (!existingPay) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.storePay.delete({ where: { id } });
    return { id, message: "Payment record deleted successfully" };
};
exports.deleteStorePayService = deleteStorePayService;
