"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moneyRate_controller_1 = require("./moneyRate.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const moneyRateRouter = (0, express_1.Router)();
// Secure all routes below
moneyRateRouter.use(auth_middleware_1.authMiddleware);
// Create a money rate
moneyRateRouter.post("/", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(moneyRate_controller_1.moneyRateController.createMoneyRate));
// Get all money rates
moneyRateRouter.get("/", (0, error_handler_1.errorHandler)(moneyRate_controller_1.moneyRateController.getMoneyRates));
// Get money rate by ID
moneyRateRouter.get("/:id", (0, error_handler_1.errorHandler)(moneyRate_controller_1.moneyRateController.getMoneyRateById));
// Update money rate
moneyRateRouter.put("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(moneyRate_controller_1.moneyRateController.updateMoneyRate));
// Delete money rate
moneyRateRouter.delete("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(moneyRate_controller_1.moneyRateController.deleteMoneyRate));
exports.default = moneyRateRouter;
