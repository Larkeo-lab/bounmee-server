"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNewsService = exports.getAllNewsService = exports.createNewsService = void 0;
exports.getNewsByIdService = getNewsByIdService;
exports.updateNewsService = updateNewsService;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const client_1 = require("@prisma/client");
const createNewsService = async (data, createdBy) => {
    return await prisma_1.prisma.news.create({
        data: {
            ...data,
            status: client_1.NewsStatus.ACTIVE,
            createdBy,
        },
    });
};
exports.createNewsService = createNewsService;
const getAllNewsService = async (page, limit, status, search, isActive, createdBy) => {
    const skip = (page - 1) * limit;
    const where = {
        isActive: isActive !== undefined ? isActive : true,
    };
    if (status) {
        where.status = status;
    }
    if (createdBy) {
        where.createdBy = createdBy;
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
        ];
    }
    const [news, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.news.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.news.count({
            where,
        }),
    ]);
    return {
        news,
        total,
    };
};
exports.getAllNewsService = getAllNewsService;
async function getNewsByIdService(id) {
    const news = await prisma_1.prisma.news.findUnique({
        where: { id },
    });
    if (!news || !news.isActive) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return news;
}
async function updateNewsService(id, data, updatedBy) {
    const news = await prisma_1.prisma.news.findUnique({
        where: { id },
        select: { id: true, isActive: true },
    });
    if (!news || !news.isActive) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return await prisma_1.prisma.news.update({
        where: { id },
        data: {
            ...data,
            updatedBy,
        },
    });
}
const deleteNewsService = async (id) => {
    const news = await prisma_1.prisma.news.findUnique({
        where: { id },
        select: { id: true, isActive: true },
    });
    if (!news || !news.isActive) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    // Soft delete
    return await prisma_1.prisma.news.update({
        where: { id },
        data: {
            isActive: false,
        },
    });
};
exports.deleteNewsService = deleteNewsService;
