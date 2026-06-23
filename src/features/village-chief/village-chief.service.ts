import { prisma } from "@config/prisma";
import { hashSync } from "bcryptjs";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  VillageChiefCreateRequest,
  VillageChiefUpdateRequest,
} from "./village-chief.validate";

export const createVillageChiefService = async (
  data: VillageChiefCreateRequest,
  createdBy: string,
) => {
  // 1. User account identity (userName / email / phone) must be unique
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

  // 2. Create the village chief record
  const villageChief = await prisma.villageChief.create({
    data: {
      chiefName: data.chiefName,
      deputyChiefName: data.deputyChiefName,
      image: data.image || null,
      bgImage: data.bgImage || null,
      createdBy,
    },
  });

  // 3. Create the linked User account (User is the central account table)
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
      villageChiefId: villageChief.id,
      userType: "VILLAGE_CHIEF",
    },
  });

  const { password, ...userWithoutPassword } = user;

  return { villageChief, user: userWithoutPassword };
};

export const getAllVillageChiefsService = async (
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [villageChiefs, total] = await prisma.$transaction([
    prisma.villageChief.findMany({
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
    prisma.villageChief.count(),
  ]);

  return {
    villageChiefs,
    total,
  };
};

export async function getVillageChiefByIdService(id: string) {
  const villageChief = await prisma.villageChief.findUnique({
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
    throw new NotFoundException(
      ErrorMessages.VILLAGE_CHIEF_NOT_FOUND,
      ErrorCode.VILLAGE_CHIEF_NOT_FOUND,
    );
  }

  return villageChief;
}

export async function updateVillageChiefService(
  id: string,
  data: VillageChiefUpdateRequest,
  updatedBy: string,
) {
  const villageChief = await prisma.villageChief.findUnique({
    where: { id },
    include: { users: { select: { id: true } } },
  });

  if (!villageChief) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_CHIEF_NOT_FOUND,
      ErrorCode.VILLAGE_CHIEF_NOT_FOUND,
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
    provinceId,
    districtId,
    villageId,
    address,
  } = data;

  // Update the linked User account if any account field was provided
  const accountUser = villageChief.users[0];
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

  return await prisma.villageChief.update({
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

// Self-profile update: a VILLAGE_CHIEF updates their own record (image/bgImage,
// chief names, account fields) — resolves the village chief from the logged-in user.
export const updateMyVillageChiefService = async (
  userId: string,
  data: VillageChiefUpdateRequest,
) => {
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { villageChiefId: true },
  });
  if (!me?.villageChiefId) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_CHIEF_NOT_FOUND,
      ErrorCode.VILLAGE_CHIEF_NOT_FOUND,
    );
  }
  return updateVillageChiefService(me.villageChiefId, data, userId);
};

export const deleteVillageChiefService = async (id: string) => {
  const villageChief = await prisma.villageChief.findUnique({
    where: { id },
  });

  if (!villageChief) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_CHIEF_NOT_FOUND,
      ErrorCode.VILLAGE_CHIEF_NOT_FOUND,
    );
  }

  await prisma.villageChief.delete({ where: { id } });

  return { villageChief };
};
