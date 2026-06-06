"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeParamsSchema = exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.createEmployeeSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Employee name is required"),
    logoUrl: zod_1.default.string().optional(),
    isActive: zod_1.default.boolean().default(true),
    storeId: zod_1.default.string().uuid("Invalid store ID"),
    phone: zod_1.default.string().min(9, "Phone number is required"),
    userName: zod_1.default.string().min(1, "Username is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.default.nativeEnum(client_1.Role).default(client_1.Role.EMPLOYEE),
    language: zod_1.default.nativeEnum(client_1.Language).default(client_1.Language.LA).optional(),
    permissionId: zod_1.default.string().uuid("Invalid permission ID").optional(),
    businessType: zod_1.default.nativeEnum(client_1.BusinessType).optional(),
});
exports.updateEmployeeSchema = exports.createEmployeeSchema.partial();
exports.employeeParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid employee ID"),
});
