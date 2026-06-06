"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = require("./permission.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const permissionRouter = (0, express_1.Router)();
// Secure all routes below
permissionRouter.use(auth_middleware_1.authMiddleware);
// Create a permission
permissionRouter.post("/", (0, error_handler_1.errorHandler)(permission_controller_1.PermissionController.createPermission));
// Get all permissions
permissionRouter.get("/", (0, error_handler_1.errorHandler)(permission_controller_1.PermissionController.getPermissions));
// Get permission by ID
permissionRouter.get("/:id", (0, error_handler_1.errorHandler)(permission_controller_1.PermissionController.getPermissionById));
// Update permission
permissionRouter.put("/:id", (0, error_handler_1.errorHandler)(permission_controller_1.PermissionController.updatePermission));
// Delete permission
permissionRouter.delete("/:id", (0, error_handler_1.errorHandler)(permission_controller_1.PermissionController.deletePermission));
exports.default = permissionRouter;
