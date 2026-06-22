"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVillageChiefService = exports.getAllVillageChiefsService = exports.createVillageChiefService = void 0;
exports.getVillageChiefByIdService = getVillageChiefByIdService;
exports.updateVillageChiefService = updateVillageChiefService;
const prisma_1 = require("../../config/prisma");
const bcryptjs_1 = require("bcryptjs");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createVillageChiefService = async (data, createdBy) => {
    // 1. User account identity (userName / email / phone) must be unique
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
    // 2. Create the village chief record
    const villageChief = await prisma_1.prisma.villageChief.create({
        data: {
            chiefName: data.chiefName,
            deputyChiefName: data.deputyChiefName,
            createdBy,
        },
    });
    // 3. Create the linked User account (User is the central account table)
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
            villageChiefId: villageChief.id,
            userType: "VILLAGE_CHIEF",
        },
    });
    const { password, ...userWithoutPassword } = user;
    return { villageChief, user: userWithoutPassword };
};
exports.createVillageChiefService = createVillageChiefService;
const getAllVillageChiefsService = async (page, limit) => {
    const skip = (page - 1) * limit;
    const [villageChiefs, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.villageChief.findMany({
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
                        provinceId: true,
                        districtId: true,
                        villageId: true,
                        address: true,
                        userType: true,
                        isActive: true,
                    },
                },
            },
        }),
        prisma_1.prisma.villageChief.count(),
    ]);
    return {
        villageChiefs,
        total,
    };
};
exports.getAllVillageChiefsService = getAllVillageChiefsService;
async function getVillageChiefByIdService(id) {
    const villageChief = await prisma_1.prisma.villageChief.findUnique({
        where: { id },
        include: {
            users: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    provinceId: true,
                    districtId: true,
                    villageId: true,
                    address: true,
                    userType: true,
                    isActive: true,
                },
            },
        },
    });
    if (!villageChief) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_CHIEF_NOT_FOUND, root_1.ErrorCode.VILLAGE_CHIEF_NOT_FOUND);
    }
    return villageChief;
}
async function updateVillageChiefService(id, data, updatedBy) {
    const villageChief = await prisma_1.prisma.villageChief.findUnique({
        where: { id },
        include: { users: { select: { id: true } } },
    });
    if (!villageChief) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_CHIEF_NOT_FOUND, root_1.ErrorCode.VILLAGE_CHIEF_NOT_FOUND);
    }
    const { chiefName, deputyChiefName, userName, password, email, phone, provinceId, districtId, villageId, address, } = data;
    // Update the linked User account if any account field was provided
    const accountUser = villageChief.users[0];
    const hasAccountChange = userName !== undefined ||
        password !== undefined ||
        email !== undefined ||
        phone !== undefined ||
        provinceId !== undefined ||
        districtId !== undefined ||
        villageId !== undefined ||
        address !== undefined;
    if (accountUser && hasAccountChange) {
        // userName / email / phone must stay unique (excluding this account)
        if (userName || email || phone) {
            const conflict = await prisma_1.prisma.user.findFirst({
                where: {
                    id: { not: accountUser.id },
                    OR: [
                        userName ? { userName } : undefined,
                        email ? { email } : undefined,
                        phone ? { phone } : undefined,
                    ].filter(Boolean),
                },
            });
            if (conflict) {
                let duplicatedField = "";
                if (userName && conflict.userName === userName) {
                    duplicatedField = "Username";
                }
                else if (email && conflict.email === email) {
                    duplicatedField = "Email";
                }
                else if (phone && conflict.phone === phone) {
                    duplicatedField = "Phone number";
                }
                throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
            }
        }
        await prisma_1.prisma.user.update({
            where: { id: accountUser.id },
            data: {
                ...(userName !== undefined ? { userName } : {}),
                ...(password ? { password: (0, bcryptjs_1.hashSync)(password, 10) } : {}),
                ...(email !== undefined ? { email: email || null } : {}),
                ...(phone !== undefined ? { phone: phone || null } : {}),
                ...(provinceId !== undefined ? { provinceId: provinceId || null } : {}),
                ...(districtId !== undefined ? { districtId: districtId || null } : {}),
                ...(villageId !== undefined ? { villageId: villageId || null } : {}),
                ...(address !== undefined ? { address: address || null } : {}),
            },
        });
    }
    return await prisma_1.prisma.villageChief.update({
        where: { id },
        data: {
            ...(chiefName !== undefined ? { chiefName } : {}),
            ...(deputyChiefName !== undefined ? { deputyChiefName } : {}),
            updatedBy,
        },
        include: {
            users: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    provinceId: true,
                    districtId: true,
                    villageId: true,
                    address: true,
                    userType: true,
                    isActive: true,
                },
            },
        },
    });
}
const deleteVillageChiefService = async (id) => {
    const villageChief = await prisma_1.prisma.villageChief.findUnique({
        where: { id },
    });
    if (!villageChief) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_CHIEF_NOT_FOUND, root_1.ErrorCode.VILLAGE_CHIEF_NOT_FOUND);
    }
    await prisma_1.prisma.villageChief.delete({ where: { id } });
    return { villageChief };
};
exports.deleteVillageChiefService = deleteVillageChiefService;
