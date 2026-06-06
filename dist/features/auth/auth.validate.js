"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.updateProfileSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    userName: zod_1.default.string().min(1, "Username is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    email: zod_1.default.string().email("Invalid email").optional().nullable(),
    phone: zod_1.default.string().optional().nullable(),
    profileImage: zod_1.default.string().optional().nullable(),
    provinceId: zod_1.default.string().uuid().optional().nullable(),
    districtId: zod_1.default.string().uuid().optional().nullable(),
    address: zod_1.default.string().optional().nullable(),
});
exports.loginSchema = zod_1.default.object({
    identifier: zod_1.default.string().min(1, "Email, username, or phone is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
});
exports.refreshTokenSchema = zod_1.default.object({
    refreshToken: zod_1.default.string().min(1, "Refresh token is required"),
});
exports.updateProfileSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email").optional().nullable(),
    phone: zod_1.default.string().optional().nullable(),
    profileImage: zod_1.default.string().optional().nullable(),
    provinceId: zod_1.default.string().uuid().optional().nullable(),
    districtId: zod_1.default.string().uuid().optional().nullable(),
    address: zod_1.default.string().optional().nullable(),
});
exports.updatePasswordSchema = zod_1.default.object({
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    userId: zod_1.default.string().optional(),
});
