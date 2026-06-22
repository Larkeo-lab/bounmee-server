"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUserType = void 0;
const forbidden_1 = require("../exceptions/forbidden");
const root_1 = require("../exceptions/root");
/**
 * Role-hierarchy guard. Must run AFTER authMiddleware (which populates
 * res.locals.payload). Allows the request only if the authenticated user's
 * type (payload.role === User.userType) is in the allowed list.
 *
 * Example: requireUserType(["POLICE_DEPARTMENT"]) — only the department
 * (highest authority) may create districts.
 */
const requireUserType = (allowed) => {
    return (_req, res, next) => {
        const userType = res.locals.payload?.role;
        if (!userType || !allowed.includes(userType)) {
            return next(new forbidden_1.ForbiddenException(root_1.ErrorMessages.FORBIDDEN, root_1.ErrorCode.FORBIDDEN));
        }
        next();
    };
};
exports.requireUserType = requireUserType;
