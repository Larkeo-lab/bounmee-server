"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeService = exports.updateEmployeeService = exports.getEmployeeByIdService = exports.getEmployeesService = exports.createEmployeeService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const bcryptjs_1 = require("bcryptjs");
const createEmployeeService = async (data) => {
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: {
            storeId: data.storeId,
            OR: [{ userName: data.userName }, { phone: data.phone }],
        },
    });
    if (existingUser) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField: "Username, Phone, or Email" });
    }
    const hashedPassword = (0, bcryptjs_1.hashSync)(data.password, 10);
    const result = await prisma_1.prisma.employee.create({
        data: {
            name: data.name,
            logoUrl: data.logoUrl,
            storeId: data.storeId,
            permissionId: data.permissionId,
            businessType: data.businessType,
            users: {
                create: {
                    password: hashedPassword,
                    storeId: data.storeId,
                    phone: data.phone,
                    userName: data.userName,
                    role: data.role,
                    language: data.language,
                },
            },
        },
        include: {
            users: true,
            store: true,
        },
    });
    return result;
};
exports.createEmployeeService = createEmployeeService;
const getEmployeesService = async (storeId) => {
    const result = await prisma_1.prisma.employee.findMany({
        where: { storeId },
        include: {
            store: true,
            users: true,
            permission: { select: { id: true, name: true } }
        },
    });
    return result;
};
exports.getEmployeesService = getEmployeesService;
const getEmployeeByIdService = async (id) => {
    const result = await prisma_1.prisma.employee.findUnique({
        where: { id },
        include: {
            store: true,
            users: true,
            permission: { select: { id: true, name: true } }
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getEmployeeByIdService = getEmployeeByIdService;
const updateEmployeeService = async (id, data) => {
    const existingEmployee = await prisma_1.prisma.employee.findUnique({
        where: { id },
        include: { users: { where: { role: "EMPLOYEE" }, take: 1 } },
    });
    if (!existingEmployee) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const adminUser = existingEmployee.users[0];
    if (adminUser && (data.userName || data.phone)) {
        const conflictUser = await prisma_1.prisma.user.findFirst({
            where: {
                storeId: existingEmployee.storeId,
                OR: [
                    ...(data.userName ? [{ userName: data.userName }] : []),
                    ...(data.phone ? [{ phone: data.phone }] : []),
                ],
                NOT: { id: adminUser.id },
            },
        });
        if (conflictUser) {
            let duplicatedField = "";
            if (data.userName && conflictUser.userName === data.userName)
                duplicatedField = "Username";
            else if (data.phone && conflictUser.phone === data.phone)
                duplicatedField = "Phone number";
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
        }
    }
    const result = await prisma_1.prisma.employee.update({
        where: { id },
        data: {
            name: data.name,
            logoUrl: data.logoUrl,
            ...(data.permissionId !== undefined ? { permissionId: data.permissionId || null } : {}),
            ...(data.businessType !== undefined ? { businessType: data.businessType || null } : {}),
            ...(adminUser && (data.userName || data.phone)
                ? {
                    users: {
                        update: {
                            where: { id: adminUser.id },
                            data: {
                                userName: data.userName,
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
exports.updateEmployeeService = updateEmployeeService;
const deleteEmployeeService = async (id) => {
    const existingEmployee = await prisma_1.prisma.employee.findUnique({ where: { id } });
    if (!existingEmployee) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.employee.delete({ where: { id } });
    return { id, message: "Employee deleted successfully" };
};
exports.deleteEmployeeService = deleteEmployeeService;
