"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const express_1 = require("express");
const police_department_controller_1 = __importDefault(require("./police-department.controller"));
const router = (0, express_1.Router)();
// === Police Department CRUD Routes ===
router.post("/", (0, error_handler_1.errorHandler)(police_department_controller_1.default.createPoliceDepartment));
router.get("/", (0, error_handler_1.errorHandler)(police_department_controller_1.default.getAllPoliceDepartments));
router.get("/:id", (0, error_handler_1.errorHandler)(police_department_controller_1.default.getPoliceDepartmentById));
router.put("/:id", (0, error_handler_1.errorHandler)(police_department_controller_1.default.updatePoliceDepartment));
router.delete("/:id", (0, error_handler_1.errorHandler)(police_department_controller_1.default.deletePoliceDepartment));
exports.default = router;
