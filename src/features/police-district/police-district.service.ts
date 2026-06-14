import { prisma } from "@config/prisma";
import { hashSync } from "bcryptjs";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  PoliceDistrictCreateRequest,
  PoliceDistrictUpdateRequest,
} from "./police-district.validate";

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
      createdBy,
    },
  });

  // 4. Create the linked User account (User is the central account table)
  const hashedPassword = hashSync(data.password, 10);
  const user = await prisma.user.create({
    data: {
      userName: data.userName,
      password: hashedPassword,
      email: data.email || null,
      phone: data.phone || null,
      provinceId: data.provinceId || null,
      districtId: data.districtId || null,
      villageId: data.villageId || null,
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
    userName,
    password,
    email,
    phone,
    provinceId,
    districtId,
    villageId,
    address,
  } = data;

  // Update the linked User account if any account field was provided
  const accountUser = policeDistrict.users[0];
  const hasAccountChange =
    userName !== undefined ||
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

    await prisma.user.update({
      where: { id: accountUser.id },
      data: {
        ...(userName !== undefined ? { userName } : {}),
        ...(password ? { password: hashSync(password, 10) } : {}),
        ...(email !== undefined ? { email: email || null } : {}),
        ...(phone !== undefined ? { phone: phone || null } : {}),
        ...(provinceId !== undefined ? { provinceId: provinceId || null } : {}),
        ...(districtId !== undefined ? { districtId: districtId || null } : {}),
        ...(villageId !== undefined ? { villageId: villageId || null } : {}),
        ...(address !== undefined ? { address: address || null } : {}),
      },
    });
  }

  return await prisma.policeDistrict.update({
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
