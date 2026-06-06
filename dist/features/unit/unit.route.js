"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unit_controller_1 = require("./unit.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const unitRouter = (0, express_1.Router)();
// Secure all routes
unitRouter.use(auth_middleware_1.authMiddleware);
// Get all units (optional filter by storeId via query)
unitRouter.get("/", (0, error_handler_1.errorHandler)(unit_controller_1.unitController.getUnits));
// Create unit
unitRouter.post("/", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(unit_controller_1.unitController.createUnit));
// Get unit by ID
unitRouter.get("/:id", (0, error_handler_1.errorHandler)(unit_controller_1.unitController.getUnitById));
// Update unit
unitRouter.put("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(unit_controller_1.unitController.updateUnit));
// Delete unit
unitRouter.delete("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(unit_controller_1.unitController.deleteUnit));
exports.default = unitRouter;
