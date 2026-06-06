import { prisma } from "@config/prisma";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  DistrictCreateRequest,
  DistrictUpdateRequest,
} from "./district.validate";

// export const createDistrictService = async (
//   data: DistrictCreateRequest,
//   createdBy: string,
// ) => {
//   // Check if province exists
//   const province = await prisma.province.findUnique({
//     where: { id: data.provinceId },
//     select: { id: true },
//   });

//   if (!province) {
//     throw new NotFoundException(
//       ErrorMessages.PROVINCE_NOT_FOUND,
//       ErrorCode.PROVINCE_NOT_FOUND,
//     );
//   }

//   // Check if district code already exists
//   const existingCode = await prisma.district.findUnique({
//     where: { id: data.code },
//     select: { id: true },
//   });

//   if (existingCode) {
//     throw new BadRequestException(
//       ErrorMessages.DISTRICT_ALREADY_EXISTS,
//       ErrorCode.DISTRICT_ALREADY_EXISTS,
//       "District with this code already exists",
//     );
//   }

//   return await prisma.district.create({
//     data: {
//       ...data,
//       createdBy,
//     },
//   });
// };

export const getAllDistrictsService = async (
  page: number,
  limit: number,
  provinceCode?: string,
) => {
  const skip = (page - 1) * limit;

  const [districts, total] = await prisma.$transaction([
    prisma.district.findMany({
      where: {
        provinceCode,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.district.count({
      where: {
        provinceCode,
      },
    }),
  ]);

  return {
    districts,
    total,
  };
};

export async function getDistrictByIdService(id: string) {
  const district = await prisma.district.findUnique({
    where: { id },
  });

  if (!district) {
    throw new NotFoundException(
      ErrorMessages.DISTRICT_NOT_FOUND,
      ErrorCode.DISTRICT_NOT_FOUND,
    );
  }
  return district;
}

export async function updateDistrictService(
  id: string,
  data: DistrictUpdateRequest,
  updatedBy: string,
) {
  const district = await prisma.district.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!district) {
    throw new NotFoundException(
      ErrorMessages.DISTRICT_NOT_FOUND,
      ErrorCode.DISTRICT_NOT_FOUND,
    );
  }

  // Check if province exists when updating provinceId
  if (data.provinceId) {
    const province = await prisma.province.findUnique({
      where: { id: data.provinceId },
      select: { id: true },
    });

    if (!province) {
      throw new NotFoundException(
        ErrorMessages.PROVINCE_NOT_FOUND,
        ErrorCode.PROVINCE_NOT_FOUND,
      );
    }
  }

  // Check if code is being updated and if it already exists
  if (data.code) {
    const existingCode = await prisma.district.findFirst({
      where: { code: data.code, id: { not: id } },
      select: { id: true },
    });

    if (existingCode) {
      throw new BadRequestException(
        ErrorMessages.DISTRICT_ALREADY_EXISTS,
        ErrorCode.DISTRICT_ALREADY_EXISTS,
        "District with this code already exists",
      );
    }
  }

  return await prisma.district.update({
    where: { id },
    data: {
      ...data,
      updatedBy,
    },
  });
}

export const deleteDistrictService = async (id: string) => {
  const district = await prisma.district.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!district) {
    throw new NotFoundException(
      ErrorMessages.DISTRICT_NOT_FOUND,
      ErrorCode.DISTRICT_NOT_FOUND,
    );
  }

  await prisma.district.delete({ where: { id } });

  return { id };
};
