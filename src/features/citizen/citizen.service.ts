import { prisma } from "@config/prisma";
import { Gender } from "@prisma/client";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type { CitizenUpdateRequest } from "./citizen.validate";



export const getAllCitizensService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [citizens, total] = await prisma.$transaction([
    prisma.citizen.findMany({
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
            userType: true,
            isActive: true,
          },
        },
      },
    }),
    prisma.citizen.count(),
  ]);

  return {
    citizens,
    total,
  };
};

export async function getCitizenByIdService(id: string) {
  const citizen = await prisma.citizen.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          userName: true,
          email: true,
          phone: true,
          userType: true,
          isActive: true,
        },
      },
    },
  });

  if (!citizen) {
    throw new NotFoundException(
      ErrorMessages.CITIZEN_NOT_FOUND,
      ErrorCode.CITIZEN_NOT_FOUND,
    );
  }

  return citizen;
}

export async function updateCitizenService(
  id: string,
  data: CitizenUpdateRequest,
  updatedBy: string,
) {
  const citizen = await prisma.citizen.findUnique({
    where: { id },
  });

  if (!citizen) {
    throw new NotFoundException(
      ErrorMessages.CITIZEN_NOT_FOUND,
      ErrorCode.CITIZEN_NOT_FOUND,
    );
  }

  if (data.cartNumber) {
    const existingCitizen = await prisma.citizen.findFirst({
      where: { cartNumber: data.cartNumber, id: { not: id } },
    });

    if (existingCitizen) {
      throw new BadRequestException(
        ErrorMessages.CITIZEN_ALREADY_EXISTS,
        ErrorCode.CITIZEN_ALREADY_EXISTS,
        "Citizen with this card number already exists",
      );
    }
  }

  const { profileImage, ...citizenData } = data;

  const updatedCitizen = await prisma.citizen.update({
    where: { id },
    data: {
      ...citizenData,
      gender: citizenData.gender as Gender | undefined,
      updatedBy,
    },
  });

  if (profileImage !== undefined) {
    await prisma.user.updateMany({
      where: { citizenId: id },
      data: { profileImage },
    });
  }

  return {
    ...updatedCitizen,
    profileImage,
  };
}

export const deleteCitizenService = async (id: string) => {
  const citizen = await prisma.citizen.findUnique({
    where: { id },
  });

  if (!citizen) {
    throw new NotFoundException(
      ErrorMessages.CITIZEN_NOT_FOUND,
      ErrorCode.CITIZEN_NOT_FOUND,
    );
  }

  await prisma.citizen.delete({ where: { id } });

  return { citizen };
};
