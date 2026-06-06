"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const employee_validate_1 = require("./employee.validate");
const employee_service_1 = require("./employee.service");
const common_validate_1 = require("../../shared/validations/common.validate");
exports.employeeController = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};
async function createEmployee(req, res) {
    const data = employee_validate_1.createEmployeeSchema.parse(req.body);
    const result = await (0, employee_service_1.createEmployeeService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getEmployees(req, res) {
    const { storeId } = common_validate_1.storeSchema.parse(req.query);
    const result = await (0, employee_service_1.getEmployeesService)(storeId);
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, 10, result.length);
}
async function getEmployeeById(req, res) {
    const { id } = employee_validate_1.employeeParamsSchema.parse(req.params);
    const result = await (0, employee_service_1.getEmployeeByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateEmployee(req, res) {
    const { id } = employee_validate_1.employeeParamsSchema.parse(req.params);
    const data = employee_validate_1.updateEmployeeSchema.parse(req.body);
    const result = await (0, employee_service_1.updateEmployeeService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteEmployee(req, res) {
    const { id } = employee_validate_1.employeeParamsSchema.parse(req.params);
    const result = await (0, employee_service_1.deleteEmployeeService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
