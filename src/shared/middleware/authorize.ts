import type { NextFunction, Request, Response } from "express";
import { ForbiddenException } from "../exceptions/forbidden";
import { ErrorCode, ErrorMessages } from "../exceptions/root";

/**
 * Role-hierarchy guard. Must run AFTER authMiddleware (which populates
 * res.locals.payload). Allows the request only if the authenticated user's
 * type (payload.role === User.userType) is in the allowed list.
 *
 * Example: requireUserType(["POLICE_DEPARTMENT"]) — only the department
 * (highest authority) may create districts.
 */
export const requireUserType = (allowed: string[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const userType = res.locals.payload?.role;

    if (!userType || !allowed.includes(userType)) {
      return next(
        new ForbiddenException(ErrorMessages.FORBIDDEN, ErrorCode.FORBIDDEN),
      );
    }

    next();
  };
};
