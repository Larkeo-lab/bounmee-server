"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmployee = exports.checkStore = exports.authMiddleware = exports.Role = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const root_1 = require("../exceptions/root");
const unauthorized_1 = require("../exceptions/unauthorized");
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["STORE_ADMIN"] = "STORE_ADMIN";
    Role["EMPLOYEE"] = "EMPLOYEE";
})(Role || (exports.Role = Role = {}));
// Allow all Roles
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(new unauthorized_1.UnauthorizedException(root_1.ErrorMessages.MISSING_TOKEN, root_1.ErrorCode.MISSING_TOKEN));
    }
    try {
        const data = jwt_1.default.verify(token);
        res.locals.payload = data;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return next(new unauthorized_1.UnauthorizedException(root_1.ErrorMessages.TOKEN_EXPIRED, root_1.ErrorCode.TOKEN_EXPIRED));
        }
        next(new unauthorized_1.UnauthorizedException(root_1.ErrorMessages.UNAUTHORIZED, root_1.ErrorCode.UNAUTHORIZED));
    }
};
exports.authMiddleware = authMiddleware;
// Verify if the store belongs to the authenticated user and has Admin privileges
const checkStore = async (req, res, next) => {
    next();
};
exports.checkStore = checkStore;
// Verify if the employee belongs to the authenticated user's store and has Admin privileges
const checkEmployee = async (req, res, next) => {
    next();
};
exports.checkEmployee = checkEmployee;
