"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storePay_controller_1 = require("./storePay.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const storePayRouter = (0, express_1.Router)();
// Secure all routes below
storePayRouter.use(auth_middleware_1.authMiddleware);
// Create a store payment
storePayRouter.post("/", (0, error_handler_1.errorHandler)(storePay_controller_1.storePayController.createStorePay));
// Get all store payments
storePayRouter.get("/", (0, error_handler_1.errorHandler)(storePay_controller_1.storePayController.getStorePays));
// Get store payment by ID
storePayRouter.get("/:id", (0, error_handler_1.errorHandler)(storePay_controller_1.storePayController.getStorePayById));
// Update store payment
storePayRouter.put("/:id", (0, error_handler_1.errorHandler)(storePay_controller_1.storePayController.updateStorePay));
// Delete store payment
storePayRouter.delete("/:id", (0, error_handler_1.errorHandler)(storePay_controller_1.storePayController.deleteStorePay));
exports.default = storePayRouter;
