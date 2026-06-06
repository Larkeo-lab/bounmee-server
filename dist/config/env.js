"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envData = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default("8080"),
    DATABASE_URL: zod_1.z.string().min(1, "PostgreSQL connection string is required"),
    JWT_SECRET: zod_1.z.string().min(1, "JWT secret is required"),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1, "JWT refresh secret is required"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("30d"),
    NODE_ENV: zod_1.z.enum(["DEV", "UAT", "PROD", "PRO", "production", "development"]).default("DEV"),
    // ค่าเหล่านี้จำเป็นต้องใช้ในระบบ OTP (ห้ามลบ)
    OTP_RATE_LIMIT_SECONDS: zod_1.z.string().default("120"),
    OTP_EXPIRATION_MINUTES: zod_1.z.string().default("10"),
    MAX_OTP_ATTEMPTS: zod_1.z.string().default("5"),
    // Storage
    STORAGE_TYPE: zod_1.z.enum(["LOCAL", "S3"]).default("LOCAL"),
    S3_ACCESS_KEY: zod_1.z.string().optional(),
    S3_SECRET_KEY: zod_1.z.string().optional(),
    S3_BUCKET_NAME: zod_1.z.string().optional(),
    S3_REGION: zod_1.z.string().optional(),
    S3_ENDPOINT: zod_1.z.string().optional(),
    S3_PUBLIC_URL: zod_1.z.string().optional(),
});
exports.envData = envSchema.parse(process.env);
