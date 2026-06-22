"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProvinceService = exports.getAllProvincesService = exports.createProvinceService = void 0;
exports.getProvinceByIdService = getProvinceByIdService;
exports.updateProvinceService = updateProvinceService;
const prisma_1 = require("../../config/prisma");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createProvinceService = async (data, updatedBy) => {
    const existingCode = await prisma_1.prisma.province.findUnique({
        where: { code: data.code },
        select: { id: true },
    });
    if (existingCode) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.PROVINCE_ALREADY_EXISTS, root_1.ErrorCode.PROVINCE_ALREADY_EXISTS, "Province with this code already exists");
    }
    return await prisma_1.prisma.province.create({
        data: {
            ...data,
            updatedBy,
        },
    });
};
exports.createProvinceService = createProvinceService;
const getAllProvincesService = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [provinces, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.province.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.province.count(),
    ]);
    return {
        provinces,
        total,
    };
};
exports.getAllProvincesService = getAllProvincesService;
async function getProvinceByIdService(id) {
    const province = await prisma_1.prisma.province.findUnique({
        where: { id },
    });
    if (!province) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.PROVINCE_NOT_FOUND, root_1.ErrorCode.PROVINCE_NOT_FOUND);
    }
    return province;
}
async function updateProvinceService(id, data, updatedBy) {
    const province = await prisma_1.prisma.province.findUnique({
        where: { id },
    });
    if (!province) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.PROVINCE_NOT_FOUND, root_1.ErrorCode.PROVINCE_NOT_FOUND);
    }
    if (data.code) {
        const existingCode = await prisma_1.prisma.province.findFirst({
            where: { code: data.code, id: { not: id } },
        });
        if (existingCode) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.PROVINCE_ALREADY_EXISTS, root_1.ErrorCode.PROVINCE_ALREADY_EXISTS, "Province with this code already exists");
        }
    }
    return await prisma_1.prisma.province.update({
        where: { id },
        data: {
            ...data,
            updatedBy,
        },
    });
}
const deleteProvinceService = async (id) => {
    const province = await prisma_1.prisma.province.findUnique({
        where: { id },
    });
    if (!province) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.PROVINCE_NOT_FOUND, root_1.ErrorCode.PROVINCE_NOT_FOUND);
    }
    await prisma_1.prisma.province.delete({ where: { id } });
    return { province };
};
exports.deleteProvinceService = deleteProvinceService;
