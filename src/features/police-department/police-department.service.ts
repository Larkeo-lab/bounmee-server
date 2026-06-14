import { prisma } from "@config/prisma";
import { hashSync } from "bcryptjs";
import { BadRequestException } from "@exceptions/bad-request";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import type {
  PoliceDepartmentCreateRequest,
  PoliceDepartmentUpdateRequest,
} from "./police-department.validate";

export const createPoliceDepartmentService = async (
  data: PoliceDepartmentCreateRequest,
  createdBy: string,
) => {
  // 1. Department name must be unique
  const existingDept = await prisma.policeDepartment.findFirst({
    where: { departmentName: data.departmentName },
    select: { id: true },
  });

  if (existingDept) {
    throw new BadRequestException(
      ErrorMessages.POLICE_DEPARTMENT_ALREADY_EXISTS,
      ErrorCode.POLICE_DEPARTMENT_ALREADY_EXISTS,
      "Police department with this name already exists",
    );
  }

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

  // 3. Create the police department record
  const policeDepartment = await prisma.policeDepartment.create({
    data: {
      departmentName: data.departmentName,
      chiefName: data.chiefName ?? null,
      deputyChiefName: data.deputyChiefName ?? null,
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
      policeDepartmentId: policeDepartment.id,
      userType: "POLICE_DEPARTMENT",
    },
  });

  const { password, ...userWithoutPassword } = user;

  return { policeDepartment, user: userWithoutPassword };
};

export const getAllPoliceDepartmentsService = async (
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [policeDepartments, total] = await prisma.$transaction([
    prisma.policeDepartment.findMany({
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
    prisma.policeDepartment.count(),
  ]);

  return {
    policeDepartments,
    total,
  };
};

export async function getPoliceDepartmentByIdService(id: string) {
  const policeDepartment = await prisma.policeDepartment.findUnique({
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

  if (!policeDepartment) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DEPARTMENT_NOT_FOUND,
      ErrorCode.POLICE_DEPARTMENT_NOT_FOUND,
    );
  }

  return policeDepartment;
}

export async function updatePoliceDepartmentService(
  id: string,
  data: PoliceDepartmentUpdateRequest,
  updatedBy: string,
) {
  const policeDepartment = await prisma.policeDepartment.findUnique({
    where: { id },
  });

  if (!policeDepartment) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DEPARTMENT_NOT_FOUND,
      ErrorCode.POLICE_DEPARTMENT_NOT_FOUND,
    );
  }

  if (data.departmentName) {
    const existingDept = await prisma.policeDepartment.findFirst({
      where: {
        departmentName: data.departmentName,
        id: { not: id },
      },
    });

    if (existingDept) {
      throw new BadRequestException(
        ErrorMessages.POLICE_DEPARTMENT_ALREADY_EXISTS,
        ErrorCode.POLICE_DEPARTMENT_ALREADY_EXISTS,
        "Police department with this name already exists",
      );
    }
  }

  return await prisma.policeDepartment.update({
    where: { id },
    data: {
      ...data,
      updatedBy,
    },
  });
}

export const deletePoliceDepartmentService = async (id: string) => {
  const policeDepartment = await prisma.policeDepartment.findUnique({
    where: { id },
  });

  if (!policeDepartment) {
    throw new NotFoundException(
      ErrorMessages.POLICE_DEPARTMENT_NOT_FOUND,
      ErrorCode.POLICE_DEPARTMENT_NOT_FOUND,
    );
  }

  await prisma.policeDepartment.delete({ where: { id } });

  return { policeDepartment };
};
