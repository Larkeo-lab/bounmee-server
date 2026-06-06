"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembersWithDebtService = exports.deleteMemberService = exports.updateMemberService = exports.getMemberByIdService = exports.getMembersService = exports.createMemberService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const createMemberService = async (data) => {
    // Check if phone already exists
    const existingMember = await prisma_1.prisma.member.findUnique({
        where: { phone: data.phone },
    });
    if (existingMember) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.MEMBER_ALREADY_EXISTS, root_1.ErrorCode.MEMBER_ALREADY_EXISTS, { duplicatedField: "phone" });
    }
    const result = await prisma_1.prisma.member.create({
        data: {
            name: data.name,
            phone: data.phone,
            points: data.points,
            storeId: data.storeId || null,
        },
    });
    return result;
};
exports.createMemberService = createMemberService;
const getMembersService = async (storeId, search) => {
    const result = await prisma_1.prisma.member.findMany({
        where: {
            ...(storeId ? { storeId } : {}),
            ...(search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
exports.getMembersService = getMembersService;
const getMemberByIdService = async (id) => {
    const result = await prisma_1.prisma.member.findUnique({
        where: { id },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.MEMBER_NOT_FOUND, root_1.ErrorCode.MEMBER_NOT_FOUND);
    }
    return result;
};
exports.getMemberByIdService = getMemberByIdService;
const updateMemberService = async (id, data) => {
    const existingMember = await prisma_1.prisma.member.findUnique({ where: { id } });
    if (!existingMember) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.MEMBER_NOT_FOUND, root_1.ErrorCode.MEMBER_NOT_FOUND);
    }
    if (data.phone) {
        const phoneExists = await prisma_1.prisma.member.findFirst({
            where: {
                phone: data.phone,
                NOT: { id },
            },
        });
        if (phoneExists) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.MEMBER_ALREADY_EXISTS, root_1.ErrorCode.MEMBER_ALREADY_EXISTS, { duplicatedField: "phone" });
        }
    }
    const result = await prisma_1.prisma.member.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateMemberService = updateMemberService;
const deleteMemberService = async (id) => {
    const existingMember = await prisma_1.prisma.member.findUnique({ where: { id } });
    if (!existingMember) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.MEMBER_NOT_FOUND, root_1.ErrorCode.MEMBER_NOT_FOUND);
    }
    await prisma_1.prisma.member.delete({ where: { id } });
    return { id, message: "Member deleted successfully" };
};
exports.deleteMemberService = deleteMemberService;
const getMembersWithDebtService = async (storeId, search, startDate, endDate, page = 1, limit = 10) => {
    const dateFilter = startDate && endDate
        ? {
            createdAt: {
                gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
            },
        }
        : {};
    const where = {
        storeId,
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
        orders: {
            some: {
                paymentStatus: { in: ["UNPAID", "PARTIALLY_PAID"] },
                ...dateFilter,
            },
        },
    };
    const result = await prisma_1.prisma.member.findMany({
        where,
        include: {
            orders: {
                where: {
                    paymentStatus: { in: ["UNPAID", "PARTIALLY_PAID"] },
                    ...dateFilter,
                },
                select: {
                    debtAmount: true,
                    dueDate: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_1.prisma.member.count({
        where,
    });
    const data = result.map((member) => {
        const totalDebt = member.orders.reduce((sum, order) => sum + Number(order.debtAmount || 0), 0);
        const unpaidCount = member.orders.length;
        const latestDueDate = member.orders
            .filter((o) => o.dueDate)
            .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))[0]?.dueDate;
        return {
            id: member.id,
            name: member.name,
            phone: member.phone,
            totalDebt,
            unpaidCount,
            latestDueDate,
        };
    });
    return { data, total };
};
exports.getMembersWithDebtService = getMembersWithDebtService;
