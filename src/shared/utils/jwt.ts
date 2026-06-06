import { envData } from "@src/config/env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IPayload {
  userId: string;
  role: string;
  storeId?: string | null;
}

export default {
  sign: (payload: IPayload) =>
    jwt.sign(payload, envData.JWT_SECRET, {
      expiresIn: envData.JWT_EXPIRES_IN as any,
      algorithm: "HS256",
    }),

  signRefreshToken: (payload: IPayload) =>
    jwt.sign(payload, envData.JWT_REFRESH_SECRET, {
      expiresIn: envData.JWT_REFRESH_EXPIRES_IN as any,
      algorithm: "HS256",
    }),

  verify: (token: string) => jwt.verify(token, envData.JWT_SECRET) as IPayload,

  verifyRefreshToken: (token: string) =>
    jwt.verify(token, envData.JWT_REFRESH_SECRET) as IPayload,
};

// Password Hashing
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
