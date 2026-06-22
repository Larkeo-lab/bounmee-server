"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const error_handler_1 = require("../../shared/middleware/error-handler");
const express_1 = require("express");
const report_controller_1 = __importDefault(require("./report.controller"));
const router = (0, express_1.Router)();
// === Report CRUD Routes ===
router.post("/", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(report_controller_1.default.createReport));
router.get("/", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(report_controller_1.default.getAllReports));
router.get("/:id", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(report_controller_1.default.getReportById));
router.put("/:id", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(report_controller_1.default.updateReport));
router.put("/:id/forward", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(report_controller_1.default.forwardReport));
router.delete("/:id", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(report_controller_1.default.deleteReport));
exports.default = router;
