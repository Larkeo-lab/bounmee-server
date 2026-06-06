"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryService = exports.updateCategoryService = exports.getCategoryByIdService = exports.getCategoriesService = exports.createCategoryService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const bad_request_1 = require("../../shared/exceptions/bad-request");
// --- Category Services ---
const createCategoryService = async (data) => {
    const existingCategory = await prisma_1.prisma.category.findFirst({
        where: {
            name: data.name,
            storeId: data.storeId,
        },
    });
    if (existingCategory) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.CATEGORY_ALREADY_EXIST, root_1.ErrorCode.CATEGORY_ALREADY_EXIST, { duplicatedField: "name" });
    }
    const result = await prisma_1.prisma.category.create({
        data,
    });
    return result;
};
exports.createCategoryService = createCategoryService;
const getCategoriesService = async (storeId) => {
    const result = await prisma_1.prisma.category.findMany({
        where: storeId ? { storeId } : {},
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
    return result;
};
exports.getCategoriesService = getCategoriesService;
const getCategoryByIdService = async (id) => {
    const result = await prisma_1.prisma.category.findUnique({
        where: { id },
        include: {
            products: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getCategoryByIdService = getCategoryByIdService;
const updateCategoryService = async (id, data) => {
    const existingCategory = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    if (data.name) {
        const conflictCategory = await prisma_1.prisma.category.findFirst({
            where: {
                name: data.name,
                storeId: existingCategory.storeId,
                NOT: { id },
            },
        });
        if (conflictCategory) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.CATEGORY_ALREADY_EXIST, root_1.ErrorCode.CATEGORY_ALREADY_EXIST, { duplicatedField: "name" });
        }
    }
    const result = await prisma_1.prisma.category.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateCategoryService = updateCategoryService;
const deleteCategoryService = async (id) => {
    const existingCategory = await prisma_1.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
    });
    if (!existingCategory) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    if (existingCategory._count.products > 0) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.CATEGORY_NOT_EMPTY, root_1.ErrorCode.CATEGORY_NOT_EMPTY, null);
    }
    await prisma_1.prisma.category.delete({ where: { id } });
    return { id, message: "Category deleted successfully" };
};
exports.deleteCategoryService = deleteCategoryService;
