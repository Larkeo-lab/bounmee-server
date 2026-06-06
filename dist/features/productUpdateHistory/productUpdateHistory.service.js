"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductUpdateHistoryService = exports.updateProductUpdateHistoryService = exports.getProductUpdateHistoryByIdService = exports.getProductUpdateHistoriesService = exports.createProductUpdateHistoryService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const productUpdateHistory_helper_1 = require("./productUpdateHistory.helper");
const createProductUpdateHistoryService = async (data) => {
    const existingProduct = await prisma_1.prisma.product.findUnique({
        where: { id: data.productId },
    });
    if (!existingProduct) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.PRODUCT_NOT_FOUND, root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    const result = await prisma_1.prisma.productUpdateHistory.create({
        data,
        include: {
            product: true,
        },
    });
    return result;
};
exports.createProductUpdateHistoryService = createProductUpdateHistoryService;
const getProductUpdateHistoriesService = async (productId, storeId, page = 1, limit = 10, search, startDate, endDate) => {
    const where = (0, productUpdateHistory_helper_1.buildProductUpdateHistoryWhereInput)(productId, storeId, search, startDate, endDate);
    const result = await prisma_1.prisma.productUpdateHistory.findMany({
        where,
        include: {
            product: true,
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_1.prisma.productUpdateHistory.count({ where });
    return { data: result, total };
};
exports.getProductUpdateHistoriesService = getProductUpdateHistoriesService;
const getProductUpdateHistoryByIdService = async (id) => {
    const result = await prisma_1.prisma.productUpdateHistory.findUnique({
        where: { id },
        include: {
            product: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getProductUpdateHistoryByIdService = getProductUpdateHistoryByIdService;
const updateProductUpdateHistoryService = async (id, data) => {
    const existingHistory = await prisma_1.prisma.productUpdateHistory.findUnique({
        where: { id },
    });
    if (!existingHistory) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    if (data.productId) {
        const existingProduct = await prisma_1.prisma.product.findUnique({
            where: { id: data.productId },
        });
        if (!existingProduct) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.PRODUCT_NOT_FOUND, root_1.ErrorCode.PRODUCT_NOT_FOUND);
        }
    }
    const result = await prisma_1.prisma.productUpdateHistory.update({
        where: { id },
        data,
        include: {
            product: true,
        },
    });
    return result;
};
exports.updateProductUpdateHistoryService = updateProductUpdateHistoryService;
const deleteProductUpdateHistoryService = async (id) => {
    const existingHistory = await prisma_1.prisma.productUpdateHistory.findUnique({
        where: { id },
    });
    if (!existingHistory) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.productUpdateHistory.delete({ where: { id } });
    return { id, message: "Product update history deleted successfully" };
};
exports.deleteProductUpdateHistoryService = deleteProductUpdateHistoryService;
