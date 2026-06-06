"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const order_validate_1 = require("./order.validate");
const order_service_1 = require("./order.service");
const common_validate_1 = require("../../shared/validations/common.validate");
exports.orderController = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updateOrderItems,
    getReportsByAdmin,
    deleteOrder,
};
async function createOrder(req, res) {
    const data = order_validate_1.createOrderSchema.parse(req.body);
    const result = await (0, order_service_1.createOrderService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getOrders(req, res) {
    const { storeId, employeeId, memberId, tableId, businessType, isDiscount, isDebt, } = order_validate_1.queryOrderSchema.parse(req.query);
    const { page, limit, search, startDate, endDate } = common_validate_1.paginationSchema.parse(req.query);
    const { data, total, summary } = await (0, order_service_1.getOrdersService)({
        storeId,
        employeeId,
        memberId,
        page,
        limit,
        search,
        startDate,
        endDate,
        tableId,
        businessType,
        isDiscount,
        isDebt,
    });
    (0, response_format_1.ResponsePaginationSuccess)(res, data, page, limit, total, 200, { summary });
}
async function getOrderById(req, res) {
    const { id } = order_validate_1.orderParamsSchema.parse(req.params);
    const result = await (0, order_service_1.getOrderByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateOrderStatus(req, res) {
    const { id } = order_validate_1.orderParamsSchema.parse(req.params);
    const data = order_validate_1.updateOrderPaymentStatusSchema.parse(req.body);
    const userId = res.locals.payload.userId;
    const result = await (0, order_service_1.updateOrderPaymentStatusService)(id, data, userId);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateOrderItems(req, res) {
    const { id } = order_validate_1.orderParamsSchema.parse(req.params);
    const data = order_validate_1.updateOrderItemsSchema.parse(req.body);
    const result = await (0, order_service_1.updateOrderItemsService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteOrder(req, res) {
    const { id } = order_validate_1.orderParamsSchema.parse(req.params);
    const result = await (0, order_service_1.deleteOrderService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
/// admin
async function getReportsByAdmin(req, res) {
    const { storeId } = order_validate_1.queryOrderSchema.parse(req.query);
    if (!storeId) {
        res.status(400).json({ message: "Store ID is required" });
        return;
    }
    const { page, limit, startDate, endDate } = common_validate_1.paginationSchema.parse(req.query);
    const { data, total, summary } = await (0, order_service_1.getReportsByAdminService)(storeId, startDate, endDate, page, limit);
    (0, response_format_1.ResponsePaginationSuccess)(res, { daily: data, summary }, page, limit, total);
}
