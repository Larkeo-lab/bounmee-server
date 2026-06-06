"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bank_controller_1 = require("./bank.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const bankRouter = (0, express_1.Router)();
// Secure all routes below
bankRouter.use(auth_middleware_1.authMiddleware);
// Create a bank
bankRouter.post("/", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(bank_controller_1.bankController.createBank));
// Get all banks
bankRouter.get("/", (0, error_handler_1.errorHandler)(bank_controller_1.bankController.getBanks));
// Get bank by ID
bankRouter.get("/:id", (0, error_handler_1.errorHandler)(bank_controller_1.bankController.getBankById));
// Update bank
bankRouter.put("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(bank_controller_1.bankController.updateBank));
// Delete bank
bankRouter.delete("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(bank_controller_1.bankController.deleteBank));
exports.default = bankRouter;
