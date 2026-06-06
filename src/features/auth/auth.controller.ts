import type { Request, Response } from "express";
import { ResponseSuccess } from "@utils/response-format";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from "./auth.validate";
import {
  registerService,
  loginService,
  refreshTokenService,
  updateProfileService,
  changePasswordService,
} from "./auth.service";

export const authController = {
  register,
  login,
  refreshToken,
  updateProfile,
  changePassword,
};

async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const result = await registerService(data);
  ResponseSuccess(res, result, 201);
}

async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const result = await loginService(data);
  ResponseSuccess(res, result);
}

async function refreshToken(req: Request, res: Response) {
  const data = refreshTokenSchema.parse(req.body);
  const result = await refreshTokenService(data);
  ResponseSuccess(res, result);
}

async function updateProfile(req: Request, res: Response) {
  const data = updateProfileSchema.parse(req.body);
  const userId = res.locals.payload.userId;
  const result = await updateProfileService(userId, data);
  ResponseSuccess(res, result);
}

async function changePassword(req: Request, res: Response) {
  const data = updatePasswordSchema.parse(req.body);
  const result = await changePasswordService(data);
  ResponseSuccess(res, result);
}
