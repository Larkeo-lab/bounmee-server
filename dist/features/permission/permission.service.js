"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermissionService = exports.updatePermissionService = exports.getPermissionByIdService = exports.getPermissionsService = exports.createPermissionService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createPermissionService = async (data, createdBy) => {
    const { permissions, ...restData } = data;
    const result = await prisma_1.prisma.permission.create({
        data: {
            ...restData,
            permissions: permissions || {}, // ✅ เพิ่ม permissions กลับไป
            createdBy: createdBy || "",
        },
    });
    return result;
};
exports.createPermissionService = createPermissionService;
const getPermissionsService = async (storeId, isActive, search) => {
    const result = await prisma_1.prisma.permission.findMany({
        where: {
            ...(storeId ? { storeId } : {}),
            ...(isActive !== undefined ? { isActive } : {}),
            ...(search ? { name: { contains: search } } : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: { employees: true }
            }
        }
    });
    return result;
};
exports.getPermissionsService = getPermissionsService;
const getPermissionByIdService = async (id) => {
    const result = await prisma_1.prisma.permission.findUnique({
        where: { id },
        include: {
            store: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getPermissionByIdService = getPermissionByIdService;
const updatePermissionService = async (id, data) => {
    const existingPermission = await prisma_1.prisma.permission.findUnique({
        where: { id },
    });
    if (!existingPermission) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const result = await prisma_1.prisma.permission.update({
        where: { id },
        data,
    });
    return result;
};
exports.updatePermissionService = updatePermissionService;
const deletePermissionService = async (id) => {
    const existingPermission = await prisma_1.prisma.permission.findUnique({
        where: { id },
    });
    if (!existingPermission) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.permission.delete({ where: { id } });
    return { id, message: "Permission deleted successfully" };
};
exports.deletePermissionService = deletePermissionService;
