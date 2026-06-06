"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const orderRouter = (0, express_1.Router)();
// Secure all routes below
orderRouter.use(auth_middleware_1.authMiddleware);
// Create order
orderRouter.post("/", (0, error_handler_1.errorHandler)(order_controller_1.orderController.createOrder));
// Get all orders (with optional filters)
orderRouter.get("/", (0, error_handler_1.errorHandler)(order_controller_1.orderController.getOrders));
// admin
orderRouter.get("/reports-by-admin", (0, error_handler_1.errorHandler)(order_controller_1.orderController.getReportsByAdmin));
// Get order by ID
orderRouter.get("/:id", (0, error_handler_1.errorHandler)(order_controller_1.orderController.getOrderById));
// Update order payment status
orderRouter.patch("/status/:id", (0, error_handler_1.errorHandler)(order_controller_1.orderController.updateOrderStatus));
// Update order items (edit order)
orderRouter.patch("/items/:id", (0, error_handler_1.errorHandler)(order_controller_1.orderController.updateOrderItems));
// Soft delete order
orderRouter.delete("/:id", (0, error_handler_1.errorHandler)(order_controller_1.orderController.deleteOrder));
exports.default = orderRouter;
