"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const police_department_validate_1 = require("./police-department.validate");
const response_format_1 = require("../../shared/utils/response-format");
const police_department_service_1 = require("./police-department.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const policeDepartmentController = {
    createPoliceDepartment,
    getAllPoliceDepartments,
    getPoliceDepartmentById,
    updatePoliceDepartment,
    deletePoliceDepartment,
};
async function createPoliceDepartment(req, res) {
    const validatedData = police_department_validate_1.policeDepartmentCreateSchema.parse(req.body);
    const result = await (0, police_department_service_1.createPoliceDepartmentService)(validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getAllPoliceDepartments(req, res) {
    const { page, limit = 100 } = common_validate_1.paginationSchema.parse(req.query);
    const result = await (0, police_department_service_1.getAllPoliceDepartmentsService)(page, limit);
    const { policeDepartments, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, policeDepartments, page, limit, total);
}
async function getPoliceDepartmentById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, police_department_service_1.getPoliceDepartmentByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updatePoliceDepartment(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = police_department_validate_1.policeDepartmentUpdateSchema.parse(req.body);
    const result = await (0, police_department_service_1.updatePoliceDepartmentService)(id, validatedData, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deletePoliceDepartment(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, police_department_service_1.deletePoliceDepartmentService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = policeDepartmentController;
