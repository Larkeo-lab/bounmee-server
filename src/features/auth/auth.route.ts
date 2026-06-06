import { Router } from "express";
import { authController } from "./auth.controller";
import { errorHandler } from "@middleware/error-handler";
import { authMiddleware } from "@src/shared/middleware/auth-middleware";

const authRouter = Router();

// Register citizen
authRouter.post("/register", errorHandler(authController.register));
// Login citizen
authRouter.post("/login", errorHandler(authController.login));
// Refresh token
authRouter.post("/refresh-token", errorHandler(authController.refreshToken));
// Update profile
authRouter.put(
  "/profile",
  authMiddleware,
  errorHandler(authController.updateProfile),
);

// Change password
authRouter.put(
  "/change-password",
  authMiddleware,
  errorHandler(authController.changePassword),
);

export default authRouter;
