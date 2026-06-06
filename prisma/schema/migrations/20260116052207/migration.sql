-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('REGISTER', 'FORGOT_PASSWORD', 'LOGIN');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('PHONE', 'EMAIL');

-- CreateEnum
CREATE TYPE "StatusOTP" AS ENUM ('REQUESTING', 'FINISHED', 'EXPIRED', 'FAILED', 'RESENT');

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "phone" VARCHAR(14),
    "email" VARCHAR(50),
    "type" "Type" NOT NULL DEFAULT 'PHONE',
    "status" "StatusOTP" NOT NULL DEFAULT 'REQUESTING',
    "otpCode" VARCHAR(6),
    "otpExpiresAt" TIMESTAMP(3),
    "otpAttempts" INTEGER NOT NULL DEFAULT 0,
    "otpLastSentAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otpType" "OtpType" NOT NULL DEFAULT 'REGISTER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_phone_otpType_idx" ON "otp"("phone", "otpType");

-- CreateIndex
CREATE INDEX "otp_email_otpType_idx" ON "otp"("email", "otpType");
