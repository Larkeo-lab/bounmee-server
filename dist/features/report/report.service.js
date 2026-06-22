"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReportService = exports.updateReportService = exports.forwardReportService = exports.getReportByIdService = exports.getAllReportsService = exports.createReportService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const root_1 = require("../../shared/exceptions/root");
const createReportService = async (data, userId) => {
    // Verify user exists
    const userExists = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!userExists) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.USER_NOT_FOUND, root_1.ErrorCode.USER_NOT_FOUND);
    }
    // Verify province if provided
    if (data.provinceId) {
        const provinceExists = await prisma_1.prisma.province.findUnique({
            where: { id: data.provinceId },
            select: { id: true },
        });
        if (!provinceExists) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.PROVINCE_NOT_FOUND, root_1.ErrorCode.PROVINCE_NOT_FOUND);
        }
    }
    // Verify district if provided
    if (data.districtId) {
        const districtExists = await prisma_1.prisma.district.findUnique({
            where: { id: data.districtId },
            select: { id: true },
        });
        if (!districtExists) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.DISTRICT_NOT_FOUND, root_1.ErrorCode.DISTRICT_NOT_FOUND);
        }
    }
    // Verify village if provided
    if (data.villageId) {
        const villageExists = await prisma_1.prisma.village.findUnique({
            where: { id: data.villageId },
            select: { id: true },
        });
        if (!villageExists) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_NOT_FOUND, root_1.ErrorCode.VILLAGE_NOT_FOUND);
        }
    }
    // Create report
    const report = await prisma_1.prisma.report.create({
        data: {
            title: data.title,
            description: data.description,
            provinceId: data.provinceId,
            districtId: data.districtId,
            villageId: data.villageId,
            location: data.location,
            image: data.image,
            video: data.video,
            attachments: data.attachments || null,
            status: data.status,
            currentAssignee: data.currentAssignee,
            userId,
        },
        include: {
            province: true,
            district: true,
            village: true,
            user: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    userType: true,
                },
            },
        },
    });
    // Log the first assignment (created → first level)
    await prisma_1.prisma.reportHistory.create({
        data: {
            reportId: report.id,
            fromAssignee: null,
            toAssignee: report.currentAssignee,
            byUserId: userId,
            note: "Created",
        },
    });
    return report;
};
exports.createReportService = createReportService;
const getAllReportsService = async (page, limit, filters) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.currentAssignee) {
        where.currentAssignee = filters.currentAssignee;
    }
    // Reports that ever reached this level (appears in the escalation history)
    if (filters.reachedAssignee) {
        where.history = { some: { toAssignee: filters.reachedAssignee } };
    }
    if (filters.provinceId) {
        where.provinceId = filters.provinceId;
    }
    if (filters.districtId) {
        where.districtId = filters.districtId;
    }
    if (filters.villageId) {
        where.villageId = filters.villageId;
    }
    if (filters.userId) {
        where.userId = filters.userId;
    }
    if (filters.search) {
        where.OR = [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
            { location: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    const [reports, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.report.findMany({
            where,
            include: {
                province: true,
                district: true,
                village: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        email: true,
                        phone: true,
                        userType: true,
                    },
                },
                history: { orderBy: { createdAt: "asc" } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.report.count({ where }),
    ]);
    return {
        reports,
        total,
    };
};
exports.getAllReportsService = getAllReportsService;
const getReportByIdService = async (id) => {
    const report = await prisma_1.prisma.report.findUnique({
        where: { id },
        include: {
            province: true,
            district: true,
            village: true,
            user: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    userType: true,
                },
            },
            history: { orderBy: { createdAt: "asc" } },
        },
    });
    if (!report) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.REPORT_NOT_FOUND, root_1.ErrorCode.REPORT_NOT_FOUND);
    }
    return report;
};
exports.getReportByIdService = getReportByIdService;
// Escalation chain: village chief → district police → department
const NEXT_ASSIGNEE = {
    VILLAGE_CHIEF: "DISTRICT_POLICE",
    DISTRICT_POLICE: "POLICE_DEPARTMENT",
};
const forwardReportService = async (id, byUserId) => {
    const report = await prisma_1.prisma.report.findUnique({
        where: { id },
        select: { id: true, currentAssignee: true },
    });
    if (!report) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.REPORT_NOT_FOUND, root_1.ErrorCode.REPORT_NOT_FOUND);
    }
    const next = NEXT_ASSIGNEE[report.currentAssignee];
    if (!next) {
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.SOMETHING_WENT_WRONG, root_1.ErrorCode.SOMETHING_WENT_WRONG, "Report is already at the highest level");
    }
    const [updated] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.report.update({
            where: { id },
            data: {
                currentAssignee: next,
                status: "IN_PROGRESS",
            },
            include: {
                province: true,
                district: true,
                village: true,
                user: {
                    select: { id: true, userName: true, email: true, phone: true, userType: true },
                },
                history: { orderBy: { createdAt: "asc" } },
            },
        }),
        prisma_1.prisma.reportHistory.create({
            data: {
                reportId: id,
                fromAssignee: report.currentAssignee,
                toAssignee: next,
                byUserId,
                note: "Forwarded",
            },
        }),
    ]);
    return updated;
};
exports.forwardReportService = forwardReportService;
const updateReportService = async (id, data) => {
    const report = await prisma_1.prisma.report.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!report) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.REPORT_NOT_FOUND, root_1.ErrorCode.REPORT_NOT_FOUND);
    }
    // Verify province if provided
    if (data.provinceId) {
        const provinceExists = await prisma_1.prisma.province.findUnique({
            where: { id: data.provinceId },
            select: { id: true },
        });
        if (!provinceExists) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.PROVINCE_NOT_FOUND, root_1.ErrorCode.PROVINCE_NOT_FOUND);
        }
    }
    // Verify district if provided
    if (data.districtId) {
        const districtExists = await prisma_1.prisma.district.findUnique({
            where: { id: data.districtId },
            select: { id: true },
        });
        if (!districtExists) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.DISTRICT_NOT_FOUND, root_1.ErrorCode.DISTRICT_NOT_FOUND);
        }
    }
    // Verify village if provided
    if (data.villageId) {
        const villageExists = await prisma_1.prisma.village.findUnique({
            where: { id: data.villageId },
            select: { id: true },
        });
        if (!villageExists) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.VILLAGE_NOT_FOUND, root_1.ErrorCode.VILLAGE_NOT_FOUND);
        }
    }
    return await prisma_1.prisma.report.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            provinceId: data.provinceId,
            districtId: data.districtId,
            villageId: data.villageId,
            location: data.location,
            image: data.image,
            video: data.video,
            attachments: data.attachments !== undefined ? data.attachments || null : undefined,
            status: data.status,
            currentAssignee: data.currentAssignee,
        },
        include: {
            province: true,
            district: true,
            village: true,
            user: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    phone: true,
                    userType: true,
                },
            },
        },
    });
};
exports.updateReportService = updateReportService;
const deleteReportService = async (id) => {
    const report = await prisma_1.prisma.report.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!report) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.REPORT_NOT_FOUND, root_1.ErrorCode.REPORT_NOT_FOUND);
    }
    await prisma_1.prisma.report.delete({
        where: { id },
    });
    return { id };
};
exports.deleteReportService = deleteReportService;
