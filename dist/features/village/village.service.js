"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVillageService = exports.getAllVillagesService = void 0;
exports.getVillageByIdService = getVillageByIdService;
exports.updateVillageService = updateVillageService;
const prisma_1 = require("../../config/prisma");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const getAllVillagesService = async (page, limit, districtCode, provinceCode) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (districtCode) {
        where.districtCode = districtCode;
    }
    if (provinceCode) {
        where.provinceCode = provinceCode;
    }
    const [villages, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.village.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.village.count({
            where,
        }),
    ]);
    return {
        villages,
        total,
    };
};
exports.getAllVillagesService = getAllVillagesService;
async function getVillageByIdService(id) {
    const village = await prisma_1.prisma.village.findUnique({
        where: { id },
    });
    if (!village) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_NOT_FOUND, root_1.ErrorCode.VILLAGE_NOT_FOUND);
    }
    return village;
}
async function updateVillageService(id, data, updatedBy) {
    const village = await prisma_1.prisma.village.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!village) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_NOT_FOUND, root_1.ErrorCode.VILLAGE_NOT_FOUND);
    }
    if (data.code) {
        const existingCode = await prisma_1.prisma.village.findFirst({
            where: { code: data.code, id: { not: id } },
            select: { id: true },
        });
        if (existingCode) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.VILLAGE_ALREADY_EXISTS, root_1.ErrorCode.VILLAGE_ALREADY_EXISTS, "Village with this code already exists");
        }
    }
    return await prisma_1.prisma.village.update({
        where: { id },
        data: {
            ...data,
            updatedBy,
        },
    });
}
const deleteVillageService = async (id) => {
    const village = await prisma_1.prisma.village.findUnique({
        where: { id },
        select: {
            id: true,
        },
    });
    if (!village) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_NOT_FOUND, root_1.ErrorCode.VILLAGE_NOT_FOUND);
    }
    await prisma_1.prisma.village.delete({ where: { id } });
    return { id };
};
exports.deleteVillageService = deleteVillageService;
