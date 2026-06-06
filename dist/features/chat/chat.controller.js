"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const server_1 = require("../../server");
const chat_service_1 = require("./chat.service");
exports.ChatController = {
    getHistory,
    getUnreadStoreCount,
    markTableAsRead,
};
async function getHistory(req, res) {
    const { tableId } = req.params;
    const result = await (0, chat_service_1.getChatHistoryService)(tableId);
    (0, response_format_1.ResponseManyDataSuccess)(res, result);
}
async function getUnreadStoreCount(req, res) {
    const { storeId } = req.params;
    const result = await (0, chat_service_1.getUnreadStoreCountService)(storeId);
    // Use ResponseManyDataSuccess to return raw count in the data field
    (0, response_format_1.ResponseManyDataSuccess)(res, result);
}
async function markTableAsRead(req, res) {
    const { tableId } = req.params;
    const { result, storeId } = await (0, chat_service_1.markTableAsReadService)(tableId);
    if (storeId) {
        server_1.io.to(`store-${storeId}`).emit("CHAT_UNREAD_COUNT_UPDATE", { tableId });
    }
    (0, response_format_1.ResponseSuccess)(res, { message: "MARKED_AS_READ", result });
}
