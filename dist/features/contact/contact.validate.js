"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactParamsSchema = exports.updateContactSchema = exports.createContactSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createContactSchema = zod_1.default.object({
    profileImage: zod_1.default.string().min(1, "Profile image is required"),
    name: zod_1.default.string().min(1, "Name is required"),
    phoneNumber: zod_1.default.string().min(1, "Phone number is required"),
    email: zod_1.default.string().email("Invalid email").min(1, "Email is required"),
    facebook: zod_1.default.string().optional(),
    instagram: zod_1.default.string().optional(),
    tiktok: zod_1.default.string().optional(),
    content: zod_1.default.string().min(1, "Content is required"),
});
exports.updateContactSchema = exports.createContactSchema.partial();
exports.contactParamsSchema = zod_1.default.object({
    id: zod_1.default.string().uuid("Invalid contact ID"),
});
