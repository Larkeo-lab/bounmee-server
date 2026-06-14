import { prisma } from "@config/prisma";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  NewsCreateRequest,
  NewsUpdateRequest,
} from "./news.validate";
import { NewsStatus } from "@prisma/client";

export const createNewsService = async (
  data: NewsCreateRequest,
  createdBy: string,
) => {
  return await prisma.news.create({
    data: {
      ...data,
      status: NewsStatus.ACTIVE,
      createdBy,
    },
  });
};

export const getAllNewsService = async (
  page: number,
  limit: number,
  status?: any,
  search?: string,
  isActive?: boolean,
  createdBy?: string,
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: isActive !== undefined ? isActive : true,
  };

  if (status) {
    where.status = status;
  }

  if (createdBy) {
    where.createdBy = createdBy;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [news, total] = await prisma.$transaction([
    prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.news.count({
      where,
    }),
  ]);

  return {
    news,
    total,
  };
};

export async function getNewsByIdService(id: string) {
  const news = await prisma.news.findUnique({
    where: { id },
  });

  if (!news || !news.isActive) {
    throw new NotFoundException(
      ErrorMessages.RESOURCE_NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }
  return news;
}

export async function updateNewsService(
  id: string,
  data: NewsUpdateRequest,
  updatedBy: string,
) {
  const news = await prisma.news.findUnique({
    where: { id },
    select: { id: true, isActive: true },
  });

  if (!news || !news.isActive) {
    throw new NotFoundException(
      ErrorMessages.RESOURCE_NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  return await prisma.news.update({
    where: { id },
    data: {
      ...data,
      updatedBy,
    },
  });
}

export const deleteNewsService = async (id: string) => {
  const news = await prisma.news.findUnique({
    where: { id },
    select: { id: true, isActive: true },
  });

  if (!news || !news.isActive) {
    throw new NotFoundException(
      ErrorMessages.RESOURCE_NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
    );
  }

  // Soft delete
  return await prisma.news.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
};
