"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnitService = exports.updateUnitService = exports.getUnitByIdService = exports.getUnitsService = exports.createUnitService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const createUnitService = async (data) => {
    const existingUnit = await prisma_1.prisma.productUnit.findFirst({
        where: {
            name: data.name,
            storeId: data.storeId,
            productId: data.productId || null,
        },
    });
    if (existingUnit) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.UNIT_ALREADY_EXISTS, root_1.ErrorCode.UNIT_ALREADY_EXISTS, { duplicatedField: "name" });
    }
    const result = await prisma_1.prisma.productUnit.create({
        data: {
            ...data,
            productId: data.productId || null,
        },
    });
    return result;
};
exports.createUnitService = createUnitService;
const getUnitsService = async (storeId, productId) => {
    const result = await prisma_1.prisma.productUnit.findMany({
        where: {
            ...(storeId && { storeId }),
            ...(productId ? { productId } : productId === null ? { productId: null } : {}),
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};
exports.getUnitsService = getUnitsService;
const getUnitByIdService = async (id) => {
    const result = await prisma_1.prisma.productUnit.findUnique({
        where: { id },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.UNIT_NOT_FOUND, root_1.ErrorCode.UNIT_NOT_FOUND);
    }
    return result;
};
exports.getUnitByIdService = getUnitByIdService;
const updateUnitService = async (id, data) => {
    const existingUnit = await prisma_1.prisma.productUnit.findUnique({ where: { id } });
    if (!existingUnit) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.UNIT_NOT_FOUND, root_1.ErrorCode.UNIT_NOT_FOUND);
    }
    if (data.name) {
        const conflictUnit = await prisma_1.prisma.productUnit.findFirst({
            where: {
                name: data.name,
                storeId: existingUnit.storeId,
                productId: existingUnit.productId,
                NOT: { id },
            },
        });
        if (conflictUnit) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.UNIT_ALREADY_EXISTS, root_1.ErrorCode.UNIT_ALREADY_EXISTS, { duplicatedField: "name" });
        }
    }
    const result = await prisma_1.prisma.productUnit.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateUnitService = updateUnitService;
const deleteUnitService = async (id) => {
    const existingUnit = await prisma_1.prisma.productUnit.findUnique({
        where: { id },
    });
    if (!existingUnit) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.UNIT_NOT_FOUND, root_1.ErrorCode.UNIT_NOT_FOUND);
    }
    await prisma_1.prisma.productUnit.delete({ where: { id } });
    return { id, message: "Unit deleted successfully" };
};
exports.deleteUnitService = deleteUnitService;
