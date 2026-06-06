"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaffSaleService = exports.updateStaffSaleService = exports.createStaffSaleService = exports.getStaffSaleByIdService = exports.getStaffSalesService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const getStaffSalesService = async (search, page = 1, limit = 10) => {
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ],
        }
        : {};
    const [data, total] = await Promise.all([
        prisma_1.prisma.staffSale.findMany({
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
            orderBy: { updatedAt: "desc" },
        }),
        prisma_1.prisma.staffSale.count({ where }),
    ]);
    return { data, total };
};
exports.getStaffSalesService = getStaffSalesService;
const getStaffSaleByIdService = async (id) => {
    const result = await prisma_1.prisma.staffSale.findUnique({
        where: { id },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                    status: true,
                },
            },
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getStaffSaleByIdService = getStaffSaleByIdService;
const createStaffSaleService = async (data) => {
    const result = await prisma_1.prisma.staffSale.create({
        data: {
            name: data.name,
            phone: data.phone,
            profileImage: data.profileImage,
        },
    });
    return result;
};
exports.createStaffSaleService = createStaffSaleService;
const updateStaffSaleService = async (id, data) => {
    const existing = await prisma_1.prisma.staffSale.findUnique({ where: { id } });
    if (!existing) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const result = await prisma_1.prisma.staffSale.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone,
            profileImage: data.profileImage,
        },
    });
    return result;
};
exports.updateStaffSaleService = updateStaffSaleService;
const deleteStaffSaleService = async (id) => {
    const existing = await prisma_1.prisma.staffSale.findUnique({ where: { id } });
    if (!existing) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.staffSale.delete({ where: { id } });
    return { id, message: "Staff sale deleted successfully" };
};
exports.deleteStaffSaleService = deleteStaffSaleService;
