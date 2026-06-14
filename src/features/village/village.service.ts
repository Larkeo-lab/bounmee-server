import { prisma } from "@config/prisma";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  VillageCreateRequest,
  VillageUpdateRequest,
} from "./village.validate";

export const getAllVillagesService = async (
  page: number,
  limit: number,
  districtCode?: string,
  provinceCode?: string,
) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (districtCode) {
    where.districtCode = districtCode;
  }
  if (provinceCode) {
    where.provinceCode = provinceCode;
  }

  const [villages, total] = await prisma.$transaction([
    prisma.village.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.village.count({
      where,
    }),
  ]);

  return {
    villages,
    total,
  };
};

export async function getVillageByIdService(id: string) {
  const village = await prisma.village.findUnique({
    where: { id },
  });

  if (!village) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_NOT_FOUND,
      ErrorCode.VILLAGE_NOT_FOUND,
    );
  }
  return village;
}

export async function updateVillageService(
  id: string,
  data: VillageUpdateRequest,
  updatedBy: string,
) {
  const village = await prisma.village.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!village) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_NOT_FOUND,
      ErrorCode.VILLAGE_NOT_FOUND,
    );
  }

  if (data.code) {
    const existingCode = await prisma.village.findFirst({
      where: { code: data.code, id: { not: id } },
      select: { id: true },
    });

    if (existingCode) {
      throw new BadRequestException(
        ErrorMessages.VILLAGE_ALREADY_EXISTS,
        ErrorCode.VILLAGE_ALREADY_EXISTS,
        "Village with this code already exists",
      );
    }
  }

  return await prisma.village.update({
    where: { id },
    data: {
      ...data,
      updatedBy,
    },
  });
}

export const deleteVillageService = async (id: string) => {
  const village = await prisma.village.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!village) {
    throw new NotFoundException(
      ErrorMessages.VILLAGE_NOT_FOUND,
      ErrorCode.VILLAGE_NOT_FOUND,
    );
  }

  await prisma.village.delete({ where: { id } });

  return { id };
};
