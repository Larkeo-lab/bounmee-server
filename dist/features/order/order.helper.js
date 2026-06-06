"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = exports.getOrderWhere = void 0;
const getOrderWhere = (filters) => {
    const { storeId, employeeId, memberId, search, startDate, endDate, tableId, businessType, isDiscount, isDebt, } = filters;
    const where = {
        isDelete: false, // ซ่อนออเดอร์ที่ถูกลบ (soft delete)
        ...(storeId ? { storeId } : {}),
        ...(employeeId ? { employeeId } : {}),
        ...(memberId ? { memberId } : {}),
        ...(tableId ? { tableId } : {}),
        ...(businessType ? { businessType } : {}),
        ...(isDiscount !== undefined ? { isDiscount } : {}),
        ...(isDebt !== undefined ? { isDebt } : {}),
    };
    if (search) {
        where.orderNumber = {
            contains: search,
            mode: "insensitive",
        };
    }
    if (startDate || endDate) {
        where.createdAt = {
            ...(startDate
                ? { gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)) }
                : {}),
            ...(endDate
                ? { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) }
                : {}),
        };
    }
    return where;
};
exports.getOrderWhere = getOrderWhere;
const generateOrderNumber = async (tx, storeId) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}${month}${day}`;
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    // Use the first 4 characters of storeId to make it unique per store
    const storePrefix = storeId.split("-")[0].toUpperCase();
    // 1. ຄົ້ນຫາອໍເດີ້ລ້າສຸດຂອງມື້ນີ້ (ສະເພາະຮ້ານນີ້) ເພື່ອລັນເລກລຳດັບ
    const lastOrder = await tx.order.findFirst({
        where: {
            storeId,
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
            orderNumber: {
                startsWith: `ORD-${storePrefix}-${dateStr}-`,
            },
        },
        orderBy: {
            orderNumber: "desc",
        },
        select: {
            orderNumber: true,
        },
    });
    let nextSequence = 1;
    if (lastOrder) {
        const parts = lastOrder.orderNumber.split("-");
        const lastSeqStr = parts[parts.length - 1];
        const lastSeq = Number.parseInt(lastSeqStr);
        if (!Number.isNaN(lastSeq)) {
            nextSequence = lastSeq + 1;
        }
    }
    const sequenceStr = String(nextSequence).padStart(4, "0");
    // 👉 ຮູບແບບ: ORD-STOREID-20260516-0001
    return `ORD-${storePrefix}-${dateStr}-${sequenceStr}`;
};
exports.generateOrderNumber = generateOrderNumber;
