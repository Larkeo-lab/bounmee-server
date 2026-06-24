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
      // A report starts at the citizen level; the village chief "ຮັບເລື່ອງ"
      // advances it to VILLAGE_CHIEF (step 2).
      currentAssignee: data.currentAssignee || "CITIZEN",
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
        // Only reports that the village chief has forwarded up (reached district)
        if (me.districtId) where.districtId = me.districtId;
        where.currentAssignee = { in: ["DISTRICT_POLICE", "POLICE_DEPARTMENT"] };
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
        reportMoreDetail: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.report.count({ where }),
  ]);

  // Attach the linked village chief (ນາຍບ້ານ) and district police (ປກສ ເມືອງ)
  // office images so the report cards can show their image / bgImage.
  const villageIds = [
    ...new Set(reports.map((r) => r.villageId).filter(Boolean) as string[]),
  ];
  const districtIds = [
    ...new Set(reports.map((r) => r.districtId).filter(Boolean) as string[]),
  ];

  const villageChiefUsers = villageIds.length
    ? await prisma.user.findMany({
        where: {
          villageId: { in: villageIds },
          userType: "VILLAGE_CHIEF",
          isActive: true,
        },
        select: {
          villageId: true,
          villageChief: {
            select: { image: true, bgImage: true, chiefName: true },
          },
        },
      })
    : [];
  const vcByVillage = new Map(
    villageChiefUsers
      .filter((u) => u.villageId && u.villageChief)
      .map((u) => [u.villageId as string, u.villageChief]),
  );

  const districtUsers = districtIds.length
    ? await prisma.user.findMany({
        where: {
          districtId: { in: districtIds },
          userType: "DISTRICT_POLICE",
          isActive: true,
        },
        select: {
          districtId: true,
          policeDistrict: {
            select: { image: true, bgImage: true, chiefName: true },
          },
        },
      })
    : [];
  const pdByDistrict = new Map(
    districtUsers
      .filter((u) => u.districtId && u.policeDistrict)
      .map((u) => [u.districtId as string, u.policeDistrict]),
  );

  const enriched = reports.map((r) => ({
    ...r,
    villageChiefInfo: r.villageId ? vcByVillage.get(r.villageId) || null : null,
    policeDistrictInfo: r.districtId
      ? pdByDistrict.get(r.districtId) || null
      : null,
  }));

  return {
    reports: enriched,
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
  CITIZEN: "VILLAGE_CHIEF", // village chief "ຮັບເລື່ອງ" (receives the case)
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
        // Delivered to the next level but not yet received → PENDING
        status: "PENDING",
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

const REPORT_INCLUDE = {
  province: true,
  district: true,
  village: true,
  user: {
    select: { id: true, userName: true, email: true, phone: true, userType: true },
  },
  history: { orderBy: { createdAt: "asc" as const } },
};

// "ຮັບເລື່ອງ" — VILLAGE_CHIEF / DISTRICT_POLICE acknowledges they are handling it.
// If the report sits at a lower level, it is pulled up to the receiver's level.
export const receiveReportService = async (id: string, userId: string) => {
  const actor = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true },
  });
  const level = actor?.userType;

  if (level !== "VILLAGE_CHIEF" && level !== "DISTRICT_POLICE") {
    throw new BadRequestException(
      ErrorMessages.SOMETHING_WENT_WRONG,
      ErrorCode.SOMETHING_WENT_WRONG,
      "Only village chief or district police can receive a report",
    );
  }

  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true, currentAssignee: true },
  });
  if (!report) {
    throw new NotFoundException(
      ErrorMessages.REPORT_NOT_FOUND,
      ErrorCode.REPORT_NOT_FOUND,
    );
  }

  const changedLevel = report.currentAssignee !== level;

  const ops: any[] = [
    prisma.report.update({
      where: { id },
      data: {
        status: "IN_PROGRESS",
        ...(changedLevel ? { currentAssignee: level } : {}),
      },
      include: REPORT_INCLUDE,
    }),
  ];
  if (changedLevel) {
    ops.push(
      prisma.reportHistory.create({
        data: {
          reportId: id,
          fromAssignee: report.currentAssignee,
          toAssignee: level,
          byUserId: userId,
          note: "Received",
        },
      }),
    );
  }

  const [updated] = await prisma.$transaction(ops);
  return updated;
};

// "ແກ້ໄຂສຳເລັດ" — mark the report resolved (citizen then sees it as resolved).
export const resolveReportService = async (
  id: string,
  userId: string,
  data?: { evidenceDetail?: string; caseConclusion?: string },
) => {
  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true, currentAssignee: true },
  });
  if (!report) {
    throw new NotFoundException(
      ErrorMessages.REPORT_NOT_FOUND,
      ErrorCode.REPORT_NOT_FOUND,
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.report.update({
      where: { id },
      data: {
        status: "APPROVED",
        evidenceDetail: data?.evidenceDetail,
        caseConclusion: data?.caseConclusion,
      },
      include: REPORT_INCLUDE,
    }),
    prisma.reportHistory.create({
      data: {
        reportId: id,
        fromAssignee: report.currentAssignee,
        toAssignee: report.currentAssignee,
        byUserId: userId,
        note: "Resolved",
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
      evidenceDetail: data.evidenceDetail,
      caseConclusion: data.caseConclusion,
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

// Add an extra-info entry to a report (citizen follow-up: ແຈ້ງຂໍ້ມູນເພີ່ມເຕີມ)
export const addReportMoreDetailService = async (
  reportId: string,
  data: { detail: string; images?: string[]; attachments?: string | null },
) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: { id: true },
  });
  if (!report) {
    throw new NotFoundException(
      ErrorMessages.REPORT_NOT_FOUND,
      ErrorCode.REPORT_NOT_FOUND,
    );
  }

  return prisma.reportMoreDetail.create({
    data: {
      reportId,
      detail: data.detail,
      images: data.images || [],
      attachments: data.attachments || null,
    },
  });
};
