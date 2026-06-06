"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSaleParamsSchema = exports.updateStaffSaleSchema = exports.createStaffSaleSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createStaffSaleSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    phone: zod_1.default.string().min(1, "Phone is required"),
    profileImage: zod_1.default.string().optional(),
});
exports.updateStaffSaleSchema = exports.createStaffSaleSchema.partial();
exports.staffSaleParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid staff sale ID"),
});
