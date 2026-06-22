"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDistrictService = exports.getAllDistrictsService = void 0;
exports.getDistrictByIdService = getDistrictByIdService;
exports.updateDistrictService = updateDistrictService;
const prisma_1 = require("../../config/prisma");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
// export const createDistrictService = async (
//   data: DistrictCreateRequest,
//   createdBy: string,
// ) => {
//   // Check if province exists
//   const province = await prisma.province.findUnique({
//     where: { id: data.provinceId },
//     select: { id: true },
//   });
//   if (!province) {
//     throw new NotFoundException(
//       ErrorMessages.PROVINCE_NOT_FOUND,
//       ErrorCode.PROVINCE_NOT_FOUND,
//     );
//   }
//   // Check if district code already exists
//   const existingCode = await prisma.district.findUnique({
//     where: { id: data.code },
//     select: { id: true },
//   });
//   if (existingCode) {
//     throw new BadRequestException(
//       ErrorMessages.DISTRICT_ALREADY_EXISTS,
//       ErrorCode.DISTRICT_ALREADY_EXISTS,
//       "District with this code already exists",
//     );
//   }
//   return await prisma.district.create({
//     data: {
//       ...data,
//       createdBy,
//     },
//   });
// };
const getAllDistrictsService = async (page, limit, provinceCode) => {
    const skip = (page - 1) * limit;
    const [districts, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.district.findMany({
            where: {
                provinceCode,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.district.count({
            where: {
                provinceCode,
            },
        }),
    ]);
    return {
        districts,
        total,
    };
};
exports.getAllDistrictsService = getAllDistrictsService;
async function getDistrictByIdService(id) {
    const district = await prisma_1.prisma.district.findUnique({
        where: { id },
    });
    if (!district) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.DISTRICT_NOT_FOUND, root_1.ErrorCode.DISTRICT_NOT_FOUND);
    }
    return district;
}
async function updateDistrictService(id, data, updatedBy) {
    const district = await prisma_1.prisma.district.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!district) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.DISTRICT_NOT_FOUND, root_1.ErrorCode.DISTRICT_NOT_FOUND);
    }
    // Check if province exists when updating provinceId
    if (data.provinceId) {
        const province = await prisma_1.prisma.province.findUnique({
            where: { id: data.provinceId },
            select: { id: true },
        });
        if (!province) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.PROVINCE_NOT_FOUND, root_1.ErrorCode.PROVINCE_NOT_FOUND);
        }
    }
    // Check if code is being updated and if it already exists
    if (data.code) {
        const existingCode = await prisma_1.prisma.district.findFirst({
            where: { code: data.code, id: { not: id } },
            select: { id: true },
        });
        if (existingCode) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.DISTRICT_ALREADY_EXISTS, root_1.ErrorCode.DISTRICT_ALREADY_EXISTS, "District with this code already exists");
        }
    }
    return await prisma_1.prisma.district.update({
        where: { id },
        data: {
            ...data,
            updatedBy,
        },
    });
}
const deleteDistrictService = async (id) => {
    const district = await prisma_1.prisma.district.findUnique({
        where: { id },
        select: {
            id: true,
        },
    });
    if (!district) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.DISTRICT_NOT_FOUND, root_1.ErrorCode.DISTRICT_NOT_FOUND);
    }
    await prisma_1.prisma.district.delete({ where: { id } });
    return { id };
};
exports.deleteDistrictService = deleteDistrictService;
