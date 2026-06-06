import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();


const envSchema = z.object({
  PORT: z.string().default("8080"),
  DATABASE_URL: z.string().min(1, "PostgreSQL connection string is required"),
  JWT_SECRET: z.string().min(1, "JWT secret is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT refresh secret is required"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  NODE_ENV: z.enum(["DEV", "UAT", "PROD", "PRO", "production", "development"]).default("DEV"),

  // ค่าเหล่านี้จำเป็นต้องใช้ในระบบ OTP (ห้ามลบ)
  OTP_RATE_LIMIT_SECONDS: z.string().default("120"),
  OTP_EXPIRATION_MINUTES: z.string().default("10"),
  MAX_OTP_ATTEMPTS: z.string().default("5"),

  // Storage
  STORAGE_TYPE: z.enum(["LOCAL", "S3"]).default("LOCAL"),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(),
});

export const envData = envSchema.parse(process.env);
export type EnvDataType = z.infer<typeof envSchema>;

