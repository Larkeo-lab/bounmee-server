import { prisma } from "@config/prisma";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  ProvinceCreateRequest,
  ProvinceUpdateRequest,
} from "./province.validate";

export const createProvinceService = async (
  data: ProvinceCreateRequest,
  updatedBy: string,
) => {
  const existingCode = await prisma.province.findUnique({
    where: { code: data.code },
    select: { id: true },
  });

  if (existingCode) {
    throw new BadRequestException(
      ErrorMessages.PROVINCE_ALREADY_EXISTS,
      ErrorCode.PROVINCE_ALREADY_EXISTS,
      "Province with this code already exists",
    );
  }

  return await prisma.province.create({
    data: {
      ...data,
      updatedBy,
    },
  });
};

export const getAllProvincesService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [provinces, total] = await prisma.$transaction([
    prisma.province.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.province.count(),
  ]);

  return {
    provinces,
    total,
  };
};

export async function getProvinceByIdService(id: string) {
  const province = await prisma.province.findUnique({
    where: { id },
  });

  if (!province) {
    throw new NotFoundException(
      ErrorMessages.PROVINCE_NOT_FOUND,
      ErrorCode.PROVINCE_NOT_FOUND,
    );
  }

  return province;
}

export async function updateProvinceService(
  id: string,
  data: ProvinceUpdateRequest,
  updatedBy: string,
) {
  const province = await prisma.province.findUnique({
    where: { id },
  });

  if (!province) {
    throw new NotFoundException(
      ErrorMessages.PROVINCE_NOT_FOUND,
      ErrorCode.PROVINCE_NOT_FOUND,
    );
  }

  if (data.code) {
    const existingCode = await prisma.province.findFirst({
      where: { code: data.code, id: { not: id } },
    });

    if (existingCode) {
      throw new BadRequestException(
        ErrorMessages.PROVINCE_ALREADY_EXISTS,
        ErrorCode.PROVINCE_ALREADY_EXISTS,
        "Province with this code already exists",
      );
    }
  }

  return await prisma.province.update({
    where: { id },
    data: {
      ...data,
      updatedBy,
    },
  });
}

export const deleteProvinceService = async (id: string) => {
  const province = await prisma.province.findUnique({
    where: { id },
  });

  if (!province) {
    throw new NotFoundException(
      ErrorMessages.PROVINCE_NOT_FOUND,
      ErrorCode.PROVINCE_NOT_FOUND,
    );
  }

  await prisma.province.delete({ where: { id } });

  return { province };
};
