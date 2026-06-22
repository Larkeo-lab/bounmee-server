"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePoliceDepartmentService = exports.getAllPoliceDepartmentsService = exports.createPoliceDepartmentService = void 0;
exports.getPoliceDepartmentByIdService = getPoliceDepartmentByIdService;
exports.updatePoliceDepartmentService = updatePoliceDepartmentService;
const prisma_1 = require("../../config/prisma");
const bcryptjs_1 = require("bcryptjs");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createPoliceDepartmentService = async (data, createdBy) => {
    // 1. Department name must be unique
    const existingDept = await prisma_1.prisma.policeDepartment.findFirst({
        where: { departmentName: data.departmentName },
        select: { id: true },
    });
    if (existingDept) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.POLICE_DEPARTMENT_ALREADY_EXISTS, root_1.ErrorCode.POLICE_DEPARTMENT_ALREADY_EXISTS, "Police department with this name already exists");
    }
    // 2. User account identity (userName / email / phone) must be unique
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                { userName: data.userName },
                data.email ? { email: data.email } : undefined,
                data.phone ? { phone: data.phone } : undefined,
            ].filter(Boolean),
        },
    });
    if (existingUser) {
        let duplicatedField = "";
        if (existingUser.userName === data.userName) {
            duplicatedField = "Username";
        }
        else if (data.email && existingUser.email === data.email) {
            duplicatedField = "Email";
        }
        else if (data.phone && existingUser.phone === data.phone) {
            duplicatedField = "Phone number";
        }
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
    }
    // 3. Create the police department record
    const policeDepartment = await prisma_1.prisma.policeDepartment.create({
        data: {
            departmentName: data.departmentName,
            chiefName: data.chiefName ?? null,
            deputyChiefName: data.deputyChiefName ?? null,
            createdBy,
        },
    });
    // 4. Create the linked User account (User is the central account table)
    const hashedPassword = (0, bcryptjs_1.hashSync)(data.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            userName: data.userName,
            password: hashedPassword,
            email: data.email || null,
            phone: data.phone || null,
            provinceId: data.provinceId || null,
            districtId: data.districtId || null,
            villageId: data.villageId || null,
            address: data.address || null,
            policeDepartmentId: policeDepartment.id,
            userType: "POLICE_DEPARTMENT",
        },
    });
    const { password, ...userWithoutPassword } = user;
    return { policeDepartment, user: userWithoutPassword };
};
exports.createPoliceDepartmentService = createPoliceDepartmentService;
const getAllPoliceDepartmentsService = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [policeDepartments, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.policeDepartment.findMany({
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
        prisma_1.prisma.policeDepartment.count(),
    ]);
    return {
        policeDepartments,
        total,
    };
};
exports.getAllPoliceDepartmentsService = getAllPoliceDepartmentsService;
async function getPoliceDepartmentByIdService(id) {
    const policeDepartment = await prisma_1.prisma.policeDepartment.findUnique({
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
    if (!policeDepartment) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.POLICE_DEPARTMENT_NOT_FOUND, root_1.ErrorCode.POLICE_DEPARTMENT_NOT_FOUND);
    }
    return policeDepartment;
}
async function updatePoliceDepartmentService(id, data, updatedBy) {
    const policeDepartment = await prisma_1.prisma.policeDepartment.findUnique({
        where: { id },
    });
    if (!policeDepartment) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.POLICE_DEPARTMENT_NOT_FOUND, root_1.ErrorCode.POLICE_DEPARTMENT_NOT_FOUND);
    }
    if (data.departmentName) {
        const existingDept = await prisma_1.prisma.policeDepartment.findFirst({
            where: {
                departmentName: data.departmentName,
                id: { not: id },
            },
        });
        if (existingDept) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.POLICE_DEPARTMENT_ALREADY_EXISTS, root_1.ErrorCode.POLICE_DEPARTMENT_ALREADY_EXISTS, "Police department with this name already exists");
        }
    }
    return await prisma_1.prisma.policeDepartment.update({
        where: { id },
        data: {
            ...data,
            updatedBy,
        },
    });
}
const deletePoliceDepartmentService = async (id) => {
    const policeDepartment = await prisma_1.prisma.policeDepartment.findUnique({
        where: { id },
    });
    if (!policeDepartment) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.POLICE_DEPARTMENT_NOT_FOUND, root_1.ErrorCode.POLICE_DEPARTMENT_NOT_FOUND);
    }
    await prisma_1.prisma.policeDepartment.delete({ where: { id } });
    return { policeDepartment };
};
exports.deletePoliceDepartmentService = deletePoliceDepartmentService;
