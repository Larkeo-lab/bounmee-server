import { envData } from "@config/env";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const calculateExpiration = (): Date => {
  const now = new Date();
  const expirationMinutes = Number.parseInt(envData.OTP_EXPIRATION_MINUTES, 10);
  now.setMinutes(now.getMinutes() + expirationMinutes);
  return now;
};
