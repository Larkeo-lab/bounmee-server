import { prisma } from "@config/prisma";
import { hashSync } from "bcryptjs";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  PoliceDistrictCreateRequest,
  PoliceDistrictUpdateRequest,
} from "./police-district.validate";

// Resolve province/district/village CODES into their row ids (null when absent/unknown)
const resolveLocationIds = async (codes: {
  provinceCode?: string | null;
  districtCode?: string | null;
  villageCode?: string | null;
}) => {
  const [province, district, village] = await Promise.all([
    codes.provinceCode
      ? prisma.province.findUnique({
          where: { code: codes.provinceCode },
          select: { id: true },
        })
      : null,
    codes.districtCode
      ? prisma.district.findFirst({
          where: { code: codes.districtCode },
          select: { id: true },
        })
      : null,
    codes.villageCode
      ? prisma.village.findUnique({
          where: { code: codes.villageCode },
          select: { id: true },
        })
      : null,
  ]);

  return {
    provinceId: province?.id ?? null,
    districtId: district?.id ?? null,
    villageId: village?.id ?? null,
  };
};

export const createPoliceDistrictService = async (
  data: PoliceDistrictCreateRequest,
  createdBy: string,
) => {
  // 2. User account identity (userName / email / phone) must be unique
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { userName: data.userName },
        data.email ? { email: data.email } : undefined,
        data.phone ? { phone: data.phone } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (existingUser) {
    let duplicatedField = "";
    if (existingUser.userName === data.userName) {
      duplicatedField = "Username";
    } else if (data.email && existingUser.email === data.email) {
      duplicatedField = "Email";
    } else if (data.phone && existingUser.phone === data.phone) {
      duplicatedField = "Phone number";
    }
    throw new BadRequestException(
      ErrorMessages.USER_ALREADY_EXISTS,
      ErrorCode.USER_ALREADY_EXISTS,
      { duplicatedField },
    );
  }

  // 3. Create the police district record
  const policeDistrict = await prisma.policeDistrict.create({
    data: {
      chiefName: data.chiefName,
      deputyChiefName: data.deputyChiefName,
      image: data.image || null,
      bgImage: data.bgImage || null,
      createdBy,
    },
  });

  // 4. Resolve location codes → ids, then create the linked User account
  const { provinceId, districtId, villageId } = await resolveLocationIds(data);
  const hashedPassword = hashSync(data.password, 10);
  const user = await prisma.user.create({
    data: {
      userName: data.userName,
      password: hashedPassword,
      email: data.email || null,
      phone: data.phone || null,
      profileImage: data.profileImage || null,
      provinceId,
      districtId,
      villageId,
      address: data.address || null,
      policeDistrictId: policeDistrict.id,
      userType: "DISTRICT_POLICE",
    },
  });

  const { password, ...userWithoutPassword } = user;

  return { policeDistrict, user: userWithoutPassword };
};

export const getAllPoliceDistrictsService = async (
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [policeDistricts, total] = await prisma.$transaction([
    prisma.policeDistrict.findMany({
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
    prisma.policeDistrict.count(),
  ]);

  return {
    policeDistricts,
    total,
  };
};

export async function getPoliceDistrictByIdService(id: string) {
  const policeDistrict = await prisma.policeDistrict.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          userName: true,
          email: true,
          phone: true,
          profileImage: true,
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

  if (!policeDistrict) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DISTRICT_NOT_FOUND,
      ErrorCode.POLICE_DISTRICT_NOT_FOUND,
    );
  }

  return policeDistrict;
}

export async function updatePoliceDistrictService(
  id: string,
  data: PoliceDistrictUpdateRequest,
  updatedBy: string,
) {
  const policeDistrict = await prisma.policeDistrict.findUnique({
    where: { id },
    include: { users: { select: { id: true } } },
  });

  if (!policeDistrict) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DISTRICT_NOT_FOUND,
      ErrorCode.POLICE_DISTRICT_NOT_FOUND,
    );
  }

  const {
    chiefName,
    deputyChiefName,
    image,
    bgImage,
    userName,
    password,
    email,
    phone,
    profileImage,
    provinceCode,
    districtCode,
    villageCode,
    address,
  } = data;

  // Update the linked User account if any account field was provided
  const accountUser = policeDistrict.users[0];
  const hasAccountChange =
    userName !== undefined ||
    password !== undefined ||
    email !== undefined ||
    phone !== undefined ||
    profileImage !== undefined ||
    provinceCode !== undefined ||
    districtCode !== undefined ||
    villageCode !== undefined ||
    address !== undefined;

  if (accountUser && hasAccountChange) {
    // userName / email / phone must stay unique (excluding this account)
    if (userName || email || phone) {
      const conflict = await prisma.user.findFirst({
        where: {
          id: { not: accountUser.id },
          OR: [
            userName ? { userName } : undefined,
            email ? { email } : undefined,
            phone ? { phone } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (conflict) {
        let duplicatedField = "";
        if (userName && conflict.userName === userName) {
          duplicatedField = "Username";
        } else if (email && conflict.email === email) {
          duplicatedField = "Email";
        } else if (phone && conflict.phone === phone) {
          duplicatedField = "Phone number";
        }
        throw new BadRequestException(
          ErrorMessages.USER_ALREADY_EXISTS,
          ErrorCode.USER_ALREADY_EXISTS,
          { duplicatedField },
        );
      }
    }

    // Resolve any provided location CODES into ids
    const resolved = await resolveLocationIds({
      provinceCode,
      districtCode,
      villageCode,
    });

    await prisma.user.update({
      where: { id: accountUser.id },
      data: {
        ...(userName !== undefined ? { userName } : {}),
        ...(password ? { password: hashSync(password, 10) } : {}),
        ...(email !== undefined ? { email: email || null } : {}),
        ...(phone !== undefined ? { phone: phone || null } : {}),
        ...(profileImage !== undefined
          ? { profileImage: profileImage || null }
          : {}),
        ...(provinceCode !== undefined
          ? { provinceId: resolved.provinceId }
          : {}),
        ...(districtCode !== undefined
          ? { districtId: resolved.districtId }
          : {}),
        ...(villageCode !== undefined
          ? { villageId: resolved.villageId }
          : {}),
        ...(address !== undefined ? { address: address || null } : {}),
      },
    });
  }

  return await prisma.policeDistrict.update({
    where: { id },
    data: {
      ...(chiefName !== undefined ? { chiefName } : {}),
      ...(deputyChiefName !== undefined ? { deputyChiefName } : {}),
      ...(image !== undefined ? { image: image || null } : {}),
      ...(bgImage !== undefined ? { bgImage: bgImage || null } : {}),
      updatedBy,
    },
    include: {
      users: {
        select: {
          id: true,
          userName: true,
          email: true,
          phone: true,
          profileImage: true,
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

// Self-profile update: a DISTRICT_POLICE updates their own office (image/bgImage,
// chief names, account fields) — resolves the police district from the logged-in user.
export const updateMyPoliceDistrictService = async (
  userId: string,
  data: PoliceDistrictUpdateRequest,
) => {
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { policeDistrictId: true },
  });
  if (!me?.policeDistrictId) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DISTRICT_NOT_FOUND,
      ErrorCode.POLICE_DISTRICT_NOT_FOUND,
    );
  }
  return updatePoliceDistrictService(me.policeDistrictId, data, userId);
};

export const deletePoliceDistrictService = async (id: string) => {
  const policeDistrict = await prisma.policeDistrict.findUnique({
    where: { id },
  });

  if (!policeDistrict) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DISTRICT_NOT_FOUND,
      ErrorCode.POLICE_DISTRICT_NOT_FOUND,
    );
  }

  await prisma.policeDistrict.delete({ where: { id } });

  return { policeDistrict };
};

// Build the card summary (office info + reports) for a single district.
const buildDistrictReportSummary = async (district: {
  id: string;
  code: string;
  nameLo: string;
  image: string | null;
}) => {
  const districtUser = await prisma.user.findFirst({
    where: {
      districtId: district.id,
      userType: "DISTRICT_POLICE",
      isActive: true,
    },
    include: {
      policeDistrict: true,
    },
  });

  const villageCount = await prisma.village.count({
    where: { districtCode: district.code },
  });

  // All reports in this district (every status)
  const badgeCount = await prisma.report.count({
    where: { districtId: district.id },
  });

  const reports = await prisma.report.findMany({
    where: { districtId: district.id },
    orderBy: { createdAt: "desc" },
  });

  // Show the time of the latest report (fall back to "" when there are none)
  const latestReportDate = reports[0]?.createdAt;
  const formattedDate = latestReportDate
    ? (() => {
        const d = new Date(latestReportDate);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      })()
    : "";

  return {
    id: district.id,
    chiefName: districtUser?.policeDistrict?.chiefName || "",
    deputyChiefName: districtUser?.policeDistrict?.deputyChiefName || "",
    districtName: district.nameLo,
    villageCount: villageCount || 0,
    badgeCount,
    date: formattedDate,
    imageUrl: district.image || "",
    // ປກສ ເມືອງ office images
    image: districtUser?.policeDistrict?.image || null,
    bgImage: districtUser?.policeDistrict?.bgImage || null,
    address: districtUser?.address || "",
    phone: districtUser?.phone || "",
    reports,
  };
};

// POLICE_DEPARTMENT (province level): every district in the user's province + reports.
export const getAllPoliceDepartmentsAndReportService = async (userId: string) => {
  if (!userId) {
    return [];
  }

  const loggedInUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!loggedInUser || !loggedInUser.provinceId) {
    return [];
  }

  const province = await prisma.province.findUnique({
    where: { id: loggedInUser.provinceId },
  });

  if (!province) {
    return [];
  }

  const districts = await prisma.district.findMany({
    where: { provinceCode: province.code },
    orderBy: { code: "asc" },
  });

  return Promise.all(districts.map(buildDistrictReportSummary));
};

// DISTRICT_POLICE (district level): only the user's own district + its reports.
export const getAllPoliceDistrictsAndReportService = async (userId: string) => {
  if (!userId) {
    return [];
  }

  const loggedInUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!loggedInUser || !loggedInUser.districtId) {
    return [];
  }

  const districts = await prisma.district.findMany({
    where: { id: loggedInUser.districtId },
  });

  return Promise.all(districts.map(buildDistrictReportSummary));
};

// Detail for one district (id = District id, as used by the reports list cards):
// returns the office info + every village in the district with its report count.
export const getPoliceDistrictByIdAndReportService = async (
  districtId: string,
) => {
  const district = await prisma.district.findUnique({
    where: { id: districtId },
  });

  if (!district) {
    throw new NotFoundException(
      ErrorMessages.DISTRICT_NOT_FOUND,
      ErrorCode.DISTRICT_NOT_FOUND,
    );
  }

  // District-police office account linked to this district
  const districtUser = await prisma.user.findFirst({
    where: {
      districtId: district.id,
      userType: "DISTRICT_POLICE",
      isActive: true,
    },
    include: { policeDistrict: true },
  });

  // All villages in this district + report count per village
  const villages = await prisma.village.findMany({
    where: { districtCode: district.code },
    orderBy: { code: "asc" },
  });

  const villagesWithReports = await Promise.all(
    villages.map(async (village) => {
      const reportCount = await prisma.report.count({
        where: { villageId: village.id },
      });

      const pendingCount = await prisma.report.count({
        where: { villageId: village.id, status: "PENDING" },
      });

      return {
        id: village.id,
        code: village.code,
        nameLo: village.nameLo,
        nameEn: village.nameEn,
        reportCount,
        pendingCount,
      };
    }),
  );

  const totalReports = villagesWithReports.reduce(
    (sum, v) => sum + v.reportCount,
    0,
  );

  return {
    id: district.id,
    districtName: district.nameLo,
    districtNameEn: district.nameEn,
    chiefName: districtUser?.policeDistrict?.chiefName || "",
    deputyChiefName: districtUser?.policeDistrict?.deputyChiefName || "",
    phone: districtUser?.phone || "",
    address: districtUser?.address || "",
    // ປກສ ເມືອງ office images (bgImage used as the cover)
    imageUrl: districtUser?.policeDistrict?.bgImage || district.image || "",
    image: districtUser?.policeDistrict?.image || null,
    bgImage: districtUser?.policeDistrict?.bgImage || null,
    villageCount: villages.length,
    totalReports,
    villages: villagesWithReports,
  };
};
