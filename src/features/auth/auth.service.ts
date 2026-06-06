import { prisma } from "@config/prisma";
import { randomUUID } from "crypto";
import { hashSync, compareSync } from "bcryptjs";
import jwt from "@src/shared/utils/jwt";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import { UnauthorizedException } from "@exceptions/unauthorized";
import { BadRequestException } from "@src/shared/exceptions/bad-request";
import type {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  UpdateProfileSchema,
  UpdatePasswordSchema,
} from "./auth.validate";

export const registerService = async (data: RegisterSchema) => {
  const hashedPassword = hashSync(data.password, 10);

  // Check if username, email, or phone is already registered
  const checkAlreadyExists = await prisma.user.findFirst({
    where: {
      OR: [
        { userName: data.userName },
        data.email ? { email: data.email } : undefined,
        data.phone ? { phone: data.phone } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (checkAlreadyExists) {
    let duplicatedField = "";
    if (checkAlreadyExists.userName === data.userName) {
      duplicatedField = "Username";
    } else if (data.email && checkAlreadyExists.email === data.email) {
      duplicatedField = "Email";
    } else if (data.phone && checkAlreadyExists.phone === data.phone) {
      duplicatedField = "Phone number";
    }
    throw new BadRequestException(
      ErrorMessages.USER_ALREADY_EXISTS,
      ErrorCode.USER_ALREADY_EXISTS,
      { duplicatedField },
    );
  }

  // Generate cartId as required by user.prisma
  const cartId = randomUUID();

  const user = await prisma.user.create({
    data: {
      userName: data.userName,
      password: hashedPassword,
      email: data.email || null,
      phone: data.phone || null,
      profileImage: data.profileImage || null,
      provinceId: data.provinceId || null,
      districtId: data.districtId || null,
      address: data.address || null,
      cartId: cartId,
      role: "CITIZEN", // Default role for registered users
    },
    include: {
      province: true,
      district: true,
    },
  });

  const accessToken = jwt.sign({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = jwt.signRefreshToken({
    userId: user.id,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const loginService = async (data: LoginSchema) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.identifier },
        { userName: data.identifier },
        { phone: data.identifier },
      ],
    },
    include: {
      province: true,
      district: true,
    },
  });

  if (!user) {
    throw new NotFoundException(
      ErrorMessages.USER_NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
    );
  }

  if (!user.password) {
    throw new NotFoundException(
      ErrorMessages.USER_NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
    );
  }

  const isPasswordValid = compareSync(data.password, user.password);
  if (!isPasswordValid) {
    throw new NotFoundException(
      ErrorMessages.INCORRECT_PASSWORD,
      ErrorCode.INCORRECT_PASSWORD,
    );
  }

  const accessToken = jwt.sign({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = jwt.signRefreshToken({
    userId: user.id,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshTokenService = async (data: RefreshTokenSchema) => {
  const { refreshToken } = data;
  const payload = jwt.verifyRefreshToken(refreshToken);

  const accessToken = jwt.sign({
    userId: payload.userId,
    role: payload.role,
  });

  const newRefreshToken = jwt.signRefreshToken({
    userId: payload.userId,
    role: payload.role,
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileSchema,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException(
      ErrorMessages.USER_NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
    );
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      email: data.email,
      phone: data.phone,
      profileImage: data.profileImage,
      provinceId: data.provinceId,
      districtId: data.districtId,
      address: data.address,
    },
    include: {
      province: true,
      district: true,
    },
  });

  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

export const changePasswordService = async (data: UpdatePasswordSchema) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new NotFoundException(
      ErrorMessages.USER_NOT_FOUND,
      ErrorCode.USER_NOT_FOUND,
    );
  }

  const hashedPassword = hashSync(data.password, 10);

  const result = await prisma.user.update({
    where: { id: data.userId },
    data: {
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};
