import jwt from "@utils/jwt";
import type { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { ErrorCode, ErrorMessages } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ForbiddenException } from "../exceptions/forbidden";
import { prisma } from "@src/config/prisma";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  STORE_ADMIN = "STORE_ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

// Allow all Roles
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(
      new UnauthorizedException(
        ErrorMessages.MISSING_TOKEN,
        ErrorCode.MISSING_TOKEN,
      ),
    );
  }
  try {
    const data = jwt.verify(token);

    res.locals.payload = data;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(
        new UnauthorizedException(
          ErrorMessages.TOKEN_EXPIRED,
          ErrorCode.TOKEN_EXPIRED,
        ),
      );
    }
    next(
      new UnauthorizedException(
        ErrorMessages.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED,
      ),
    );
  }
};

// Verify if the store belongs to the authenticated user and has Admin privileges
export const checkStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next();
};

// Verify if the employee belongs to the authenticated user's store and has Admin privileges
export const checkEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next();
};

