"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("./employee.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const employeeRouter = (0, express_1.Router)();
// Secure all routes - only admins can manage employees
employeeRouter.use(auth_middleware_1.authMiddleware);
// No top-level restrictTo anymore, it's handled by individual checks or checkStore below
// Create employee
employeeRouter.post("/", 
//checkStore,
(0, error_handler_1.errorHandler)(employee_controller_1.employeeController.createEmployee));
// Get all employees
employeeRouter.get("/", 
//checkStore,
(0, error_handler_1.errorHandler)(employee_controller_1.employeeController.getEmployees));
// Get employee by ID
employeeRouter.get("/:id", 
//checkEmployee,
(0, error_handler_1.errorHandler)(employee_controller_1.employeeController.getEmployeeById));
// Update employee
employeeRouter.put("/:id", 
//checkEmployee,
(0, error_handler_1.errorHandler)(employee_controller_1.employeeController.updateEmployee));
// Delete employee
employeeRouter.delete("/:id", 
//checkEmployee,
(0, error_handler_1.errorHandler)(employee_controller_1.employeeController.deleteEmployee));
exports.default = employeeRouter;
