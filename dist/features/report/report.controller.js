"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_validate_1 = require("../../shared/validations/common.validate");
const response_format_1 = require("../../shared/utils/response-format");
const report_service_1 = require("./report.service");
const report_validate_1 = require("./report.validate");
const reportController = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    forwardReport,
    deleteReport,
};
async function createReport(req, res) {
    const validatedData = report_validate_1.reportCreateSchema.parse(req.body);
    const userId = res.locals.payload.userId;
    const result = await (0, report_service_1.createReportService)(validatedData, userId);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getAllReports(req, res) {
    const { page, limit } = common_validate_1.paginationSchema.parse(req.query);
    const filters = report_validate_1.reportQuerySchema.parse(req.query);
    const result = await (0, report_service_1.getAllReportsService)(page, limit, filters);
    const { reports, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, reports, page, limit, total);
}
async function getReportById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, report_service_1.getReportByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateReport(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = report_validate_1.reportUpdateSchema.parse(req.body);
    const result = await (0, report_service_1.updateReportService)(id, validatedData);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function forwardReport(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const byUserId = res.locals.payload.userId;
    const result = await (0, report_service_1.forwardReportService)(id, byUserId);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteReport(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, report_service_1.deleteReportService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = reportController;
