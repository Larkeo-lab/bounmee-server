"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffSale_controller_1 = require("./staffSale.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const staffSaleRouter = (0, express_1.Router)();
staffSaleRouter.use(auth_middleware_1.authMiddleware);
// Get all staff sales
staffSaleRouter.get("/", (0, error_handler_1.errorHandler)(staffSale_controller_1.staffSaleController.getStaffSales));
// Get staff sale by ID
staffSaleRouter.get("/:id", (0, error_handler_1.errorHandler)(staffSale_controller_1.staffSaleController.getStaffSaleById));
// Create staff sale
staffSaleRouter.post("/", (0, error_handler_1.errorHandler)(staffSale_controller_1.staffSaleController.createStaffSale));
// Update staff sale
staffSaleRouter.put("/:id", (0, error_handler_1.errorHandler)(staffSale_controller_1.staffSaleController.updateStaffSale));
// Delete staff sale
staffSaleRouter.delete("/:id", (0, error_handler_1.errorHandler)(staffSale_controller_1.staffSaleController.deleteStaffSale));
exports.default = staffSaleRouter;
