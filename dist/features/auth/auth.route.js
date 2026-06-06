"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const error_handler_1 = require("@middleware/error-handler");
const auth_middleware_1 = require("@src/shared/middleware/auth-middleware");
const authRouter = (0, express_1.Router)();
// Register citizen
authRouter.post("/register", (0, error_handler_1.errorHandler)(auth_controller_1.authController.register));
// Login citizen
authRouter.post("/login", (0, error_handler_1.errorHandler)(auth_controller_1.authController.login));
// Refresh token
authRouter.post("/refresh-token", (0, error_handler_1.errorHandler)(auth_controller_1.authController.refreshToken));
// Update profile
authRouter.put("/profile", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(auth_controller_1.authController.updateProfile));
// Change password
authRouter.put("/change-password", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(auth_controller_1.authController.changePassword));
exports.default = authRouter;
