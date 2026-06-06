"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const order_validate_1 = require("../order/order.validate");
const common_validate_1 = require("../../shared/validations/common.validate");
const dashboard_service_1 = require("./dashboard.service");
exports.dashboardController = {
    getDashboard,
};
async function getDashboard(req, res) {
    const { storeId, employeeId } = order_validate_1.queryOrderSchema.parse(req.query);
    const { startDate, endDate } = common_validate_1.paginationSchema.parse(req.query);
    const result = await (0, dashboard_service_1.getDashboardService)({
        storeId,
        employeeId,
        startDate,
        endDate,
    });
    (0, response_format_1.ResponseSuccess)(res, result);
}
