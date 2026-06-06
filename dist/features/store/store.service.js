"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStoreService = exports.updateStoreService = exports.getStoreByIdService = exports.getStoresService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const root_1 = require("../../shared/exceptions/root");
const store_helper_1 = require("./store.helper");
const getStoresService = async (search, filter, page = 1, limit = 10) => {
    const where = (0, store_helper_1.buildStoreWhereInput)(search, filter);
    const [data, total] = await Promise.all([
        prisma_1.prisma.store.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                users: { select: { id: true, email: true, phone: true, role: true, userName: true, isActive: true, language: true, photoURL: true, createdAt: true, updatedAt: true, storeId: true, employeeId: true } },
                province: true,
                district: true,
                staffSale: true,
            },
        }),
        prisma_1.prisma.store.count({ where }),
    ]);
    return { data, total };
};
exports.getStoresService = getStoresService;
const getStoreByIdService = async (id) => {
    const result = await prisma_1.prisma.store.findUnique({
        where: { id },
        include: {
            users: { select: { id: true, email: true, phone: true, role: true, userName: true, isActive: true, language: true, photoURL: true, createdAt: true, updatedAt: true, storeId: true, employeeId: true } },
            province: true,
            district: true,
            staffSale: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getStoreByIdService = getStoreByIdService;
const updateStoreService = async (id, data) => {
    const existingStore = await prisma_1.prisma.store.findUnique({
        where: { id },
        include: { users: { where: { role: "STORE_ADMIN" }, take: 1 } },
    });
    if (!existingStore) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const adminUser = existingStore.users[0];
    if (adminUser && (data.email || data.phone)) {
        const conflictUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    ...(data.email ? [{ email: data.email }] : []),
                    ...(data.phone ? [{ phone: data.phone }] : []),
                ],
                NOT: { id: adminUser.id },
            },
        });
        if (conflictUser) {
            let duplicatedField = "";
            if (data.email && conflictUser.email === data.email)
                duplicatedField = "Email";
            else if (data.phone && conflictUser.phone === data.phone)
                duplicatedField = "Phone number";
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
        }
    }
    const result = await prisma_1.prisma.store.update({
        where: { id },
        data: {
            name: data.name,
            address: data.address,
            logoUrl: data.logoUrl,
            status: data.status,
            isActive: data.isActive,
            type: data.type,
            bussinessType: data.bussinessType,
            provinceId: data.provinceId,
            districtId: data.districtId,
            staffSaleId: data.staffSaleId,
            startDate: data.startDate,
            endDate: data.endDate,
            ...(adminUser && (data.email || data.phone)
                ? {
                    users: {
                        update: {
                            where: { id: adminUser.id },
                            data: {
                                email: data.email,
                                phone: data.phone,
                                language: data.language,
                            },
                        },
                    },
                }
                : {}),
        },
        include: {
            users: true,
        },
    });
    return {
        id: result.id,
    };
};
exports.updateStoreService = updateStoreService;
const deleteStoreService = async (id) => {
    const existingStore = await prisma_1.prisma.store.findUnique({ where: { id } });
    if (!existingStore) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.store.delete({ where: { id } });
    return { id, message: "Store deleted successfully" };
};
exports.deleteStoreService = deleteStoreService;
