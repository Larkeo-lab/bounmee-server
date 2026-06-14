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
  changePasswordService,
} from "./auth.service";

export const authController = {
  registerCitizen,
  login,
  refreshToken,
  changePassword,
};

async function registerCitizen(req: Request, res: Response) {
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



async function changePassword(req: Request, res: Response) {
  const data = updatePasswordSchema.parse(req.body);
  const result = await changePasswordService(data);
  ResponseSuccess(res, result);
}
