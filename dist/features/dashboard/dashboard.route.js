"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const dashboardRouter = (0, express_1.Router)();
// Secure all routes
dashboardRouter.use(auth_middleware_1.authMiddleware);
// Get dashboard data
dashboardRouter.get("/", (0, error_handler_1.errorHandler)(dashboard_controller_1.dashboardController.getDashboard));
exports.default = dashboardRouter;
