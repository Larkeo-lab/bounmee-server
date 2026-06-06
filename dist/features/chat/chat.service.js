"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTableAsReadService = exports.getUnreadStoreCountService = exports.getChatHistoryService = void 0;
const prisma_1 = require("../../config/prisma");
const getChatHistoryService = async (tableId) => {
    return prisma_1.prisma.chatMessage.findMany({
        where: { tableId, isArchived: false },
        orderBy: { timestamp: "asc" },
    });
};
exports.getChatHistoryService = getChatHistoryService;
const getUnreadStoreCountService = async (storeId) => {
    const unreadRows = await prisma_1.prisma.chatMessage.groupBy({
        by: ["tableId"],
        where: { storeId, isRead: false, isArchived: false, sender: "customer" },
        _count: { _all: true },
    });
    const lastMessages = await prisma_1.prisma.chatMessage.findMany({
        where: { storeId, isArchived: false },
        distinct: ["tableId"],
        orderBy: { timestamp: "desc" },
    });
    return {
        unreadCounts: unreadRows.reduce((acc, curr) => ({ ...acc, [curr.tableId]: curr._count._all }), {}),
        lastMessages: lastMessages.reduce((acc, curr) => ({ ...acc, [curr.tableId]: curr }), {}),
    };
};
exports.getUnreadStoreCountService = getUnreadStoreCountService;
const markTableAsReadService = async (tableId) => {
    const result = await prisma_1.prisma.chatMessage.updateMany({
        where: { tableId, isRead: false, isArchived: false, sender: "customer" },
        data: { isRead: true },
    });
    const table = await prisma_1.prisma.table.findUnique({
        where: { id: tableId },
        select: { storeId: true },
    });
    return { result, storeId: table?.storeId };
};
exports.markTableAsReadService = markTableAsReadService;
