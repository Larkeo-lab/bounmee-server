"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCitizenService = exports.getAllCitizensService = void 0;
exports.getCitizenByIdService = getCitizenByIdService;
exports.updateCitizenService = updateCitizenService;
const prisma_1 = require("../../config/prisma");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const getAllCitizensService = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [citizens, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.citizen.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                users: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phone: true,
                        userType: true,
                        isActive: true,
                    },
                },
            },
        }),
        prisma_1.prisma.citizen.count(),
    ]);
    return {
        citizens,
        total,
    };
};
exports.getAllCitizensService = getAllCitizensService;
async function getCitizenByIdService(id) {
    const citizen = await prisma_1.prisma.citizen.findUnique({
        where: { id },
        include: {
            users: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    userType: true,
                    isActive: true,
                },
            },
        },
    });
    if (!citizen) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.CITIZEN_NOT_FOUND, root_1.ErrorCode.CITIZEN_NOT_FOUND);
    }
    return citizen;
}
async function updateCitizenService(id, data, updatedBy) {
    const citizen = await prisma_1.prisma.citizen.findUnique({
        where: { id },
    });
    if (!citizen) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.CITIZEN_NOT_FOUND, root_1.ErrorCode.CITIZEN_NOT_FOUND);
    }
    if (data.cartNumber) {
        const existingCitizen = await prisma_1.prisma.citizen.findFirst({
            where: { cartNumber: data.cartNumber, id: { not: id } },
        });
        if (existingCitizen) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.CITIZEN_ALREADY_EXISTS, root_1.ErrorCode.CITIZEN_ALREADY_EXISTS, "Citizen with this card number already exists");
        }
    }
    return await prisma_1.prisma.citizen.update({
        where: { id },
        data: {
            ...data,
            gender: data.gender,
            updatedBy,
        },
    });
}
const deleteCitizenService = async (id) => {
    const citizen = await prisma_1.prisma.citizen.findUnique({
        where: { id },
    });
    if (!citizen) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.CITIZEN_NOT_FOUND, root_1.ErrorCode.CITIZEN_NOT_FOUND);
    }
    await prisma_1.prisma.citizen.delete({ where: { id } });
    return { citizen };
};
exports.deleteCitizenService = deleteCitizenService;
