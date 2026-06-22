import { prisma } from "@config/prisma";
import { NotFoundException } from "@exceptions/not-found";
import { BadRequestException } from "@exceptions/bad-request";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type { Prisma } from "@prisma/client";
import type {
  ReportCreateRequest,
  ReportQueryRequest,
  ReportUpdateRequest,
} from "./report.validate";

export const createReportService = async (data: ReportCreateRequest, userId: string) => {
  // Verify user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!userExists) {
    throw new NotFoundException(ErrorMessages.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND);
  }

  // Verify province if provided
  if (data.provinceId) {
    const provinceExists = await prisma.province.findUnique({
      where: { id: data.provinceId },
      select: { id: true },
    });
    if (!provinceExists) {
      throw new NotFoundException(ErrorMessages.PROVINCE_NOT_FOUND, ErrorCode.PROVINCE_NOT_FOUND);
    }
  }

  // Verify district if provided
  if (data.districtId) {
    const districtExists = await prisma.district.findUnique({
      where: { id: data.districtId },
      select: { id: true },
    });
    if (!districtExists) {
      throw new NotFoundException(ErrorMessages.DISTRICT_NOT_FOUND, ErrorCode.DISTRICT_NOT_FOUND);
    }
  }

  // Verify village if provided
  if (data.villageId) {
    const villageExists = await prisma.village.findUnique({
      where: { id: data.villageId },
      select: { id: true },
    });
    if (!villageExists) {
      throw new NotFoundException(ErrorMessages.VILLAGE_NOT_FOUND, ErrorCode.VILLAGE_NOT_FOUND);
    }
  }

  // Create report
  const report = await prisma.report.create({
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
  await prisma.reportHistory.create({
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

export const getAllReportsService = async (
  page: number,
  limit: number,
  filters: ReportQueryRequest,
  loggedInUserId?: string,
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.ReportWhereInput = {};

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

  // Geographic / owner scope is ENFORCED from the logged-in user (not trusted
  // from client filters), based on their userType:
  //   POLICE_DEPARTMENT → province, DISTRICT_POLICE → district,
  //   VILLAGE_CHIEF → village, CITIZEN → only their own reports.
  if (loggedInUserId) {
    const me = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: {
        id: true,
        userType: true,
        provinceId: true,
        districtId: true,
        villageId: true,
      },
    });

    if (me) {
      if (me.userType === "POLICE_DEPARTMENT") {
        if (me.provinceId) where.provinceId = me.provinceId;
      } else if (me.userType === "DISTRICT_POLICE") {
        if (me.districtId) where.districtId = me.districtId;
      } else if (me.userType === "VILLAGE_CHIEF") {
        if (me.villageId) where.villageId = me.villageId;
      } else {
        // CITIZEN (and any other) only sees their own reports
        where.userId = me.id;
      }
    }
  } else {
    // No authenticated user → fall back to explicit client filters
    if (filters.provinceId) where.provinceId = filters.provinceId;
    if (filters.districtId) where.districtId = filters.districtId;
    if (filters.villageId) where.villageId = filters.villageId;
    if (filters.userId) where.userId = filters.userId;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [reports, total] = await prisma.$transaction([
    prisma.report.findMany({
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
    prisma.report.count({ where }),
  ]);

  return {
    reports,
    total,
  };
};

// All reports for one village (+ the village info for the page header)
export const getVillageReportsService = async (villageId: string) => {
  const village = await prisma.village.findUnique({
    where: { id: villageId },
  });

  if (!village) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_NOT_FOUND,
      ErrorCode.VILLAGE_NOT_FOUND,
    );
  }

  // Village chief office account linked to this village (if any)
  const villageUser = await prisma.user.findFirst({
    where: {
      villageId: village.id,
      userType: "VILLAGE_CHIEF",
      isActive: true,
    },
    include: { villageChief: true },
  });

  const reports = await prisma.report.findMany({
    where: { villageId },
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
  });

  return {
    village: {
      ...village,
      chiefName: villageUser?.villageChief?.chiefName || "",
      deputyChiefName: villageUser?.villageChief?.deputyChiefName || "",
      phone: villageUser?.phone || "",
      email: villageUser?.email || "",
      address: villageUser?.address || "",
    },
    reports,
    total: reports.length,
  };
};

export const getReportByIdService = async (id: string) => {
  const report = await prisma.report.findUnique({
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
    throw new NotFoundException(ErrorMessages.REPORT_NOT_FOUND, ErrorCode.REPORT_NOT_FOUND);
  }

  return report;
};

// Escalation chain: village chief → district police → department
const NEXT_ASSIGNEE: Record<string, string | undefined> = {
  VILLAGE_CHIEF: "DISTRICT_POLICE",
  DISTRICT_POLICE: "POLICE_DEPARTMENT",
};

export const forwardReportService = async (id: string, byUserId: string) => {
  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true, currentAssignee: true },
  });

  if (!report) {
    throw new NotFoundException(ErrorMessages.REPORT_NOT_FOUND, ErrorCode.REPORT_NOT_FOUND);
  }

  const next = NEXT_ASSIGNEE[report.currentAssignee];
  if (!next) {
    throw new BadRequestException(
      ErrorMessages.SOMETHING_WENT_WRONG,
      ErrorCode.SOMETHING_WENT_WRONG,
      "Report is already at the highest level",
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.report.update({
      where: { id },
      data: {
        currentAssignee: next as any,
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
    prisma.reportHistory.create({
      data: {
        reportId: id,
        fromAssignee: report.currentAssignee,
        toAssignee: next as any,
        byUserId,
        note: "Forwarded",
      },
    }),
  ]);

  return updated;
};

export const updateReportService = async (id: string, data: ReportUpdateRequest) => {
  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!report) {
    throw new NotFoundException(ErrorMessages.REPORT_NOT_FOUND, ErrorCode.REPORT_NOT_FOUND);
  }

  // Verify province if provided
  if (data.provinceId) {
    const provinceExists = await prisma.province.findUnique({
      where: { id: data.provinceId },
      select: { id: true },
    });
    if (!provinceExists) {
      throw new NotFoundException(ErrorMessages.PROVINCE_NOT_FOUND, ErrorCode.PROVINCE_NOT_FOUND);
    }
  }

  // Verify district if provided
  if (data.districtId) {
    const districtExists = await prisma.district.findUnique({
      where: { id: data.districtId },
      select: { id: true },
    });
    if (!districtExists) {
      throw new NotFoundException(ErrorMessages.DISTRICT_NOT_FOUND, ErrorCode.DISTRICT_NOT_FOUND);
    }
  }

  // Verify village if provided
  if (data.villageId) {
    const villageExists = await prisma.village.findUnique({
      where: { id: data.villageId },
      select: { id: true },
    });
    if (!villageExists) {
      throw new NotFoundException(ErrorMessages.VILLAGE_NOT_FOUND, ErrorCode.VILLAGE_NOT_FOUND);
    }
  }

  return await prisma.report.update({
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

export const deleteReportService = async (id: string) => {
  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!report) {
    throw new NotFoundException(ErrorMessages.REPORT_NOT_FOUND, ErrorCode.REPORT_NOT_FOUND);
  }

  await prisma.report.delete({
    where: { id },
  });

  return { id };
};
