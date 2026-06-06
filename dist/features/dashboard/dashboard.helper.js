"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueTrend = exports.getDashboardWhere = void 0;
const prisma_1 = require("../../config/prisma");
const getDashboardWhere = (storeId, startDate, endDate) => {
    const where = {
        isDelete: false, // ไม่นับออเดอร์ที่ถูกลบ (soft delete)
        ...(storeId ? { storeId } : {}),
    };
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
exports.getDashboardWhere = getDashboardWhere;
const getRevenueTrend = async (where, data) => {
    const { storeId, startDate, endDate } = data;
    if (!startDate || !endDate)
        return [];
    const start = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    // Calculate diff in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let grouping = "day";
    if (diffDays > 365) {
        grouping = "year";
    }
    else if (diffDays > 31) {
        grouping = "month";
    }
    const whereExpense = {
        storeId,
        createdAt: {
            gte: start,
            lte: end,
        },
    };
    // Fetch all orders with their items and item costs within range
    const orders = await prisma_1.prisma.order.findMany({
        where: where,
        include: {
            items: {
                select: {
                    qty: true,
                    product: {
                        select: {
                            cost: true,
                            fixPrice: true,
                            isFix: true,
                        },
                    },
                },
            },
        },
    });
    const trends = {};
    // Initialize time slots to ensure no gaps in the graph
    const current = new Date(start);
    while (current <= end) {
        const key = getFormatKey(current, grouping);
        if (!trends[key]) {
            trends[key] = { sales: 0, expenses: 0, profit: 0, repairCost: 0 };
        }
        if (grouping === "year")
            current.setFullYear(current.getFullYear() + 1);
        else if (grouping === "month")
            current.setMonth(current.getMonth() + 1);
        else
            current.setDate(current.getDate() + 1);
    }
    // Aggregate orders and their actual item costs
    for (const order of orders) {
        const key = getFormatKey(order.createdAt, grouping);
        if (trends[key]) {
            const orderSales = Number(order.totalAmount);
            const orderCost = order.items.reduce((sum, item) => {
                return sum + item.qty * Number(item.product.cost);
            }, 0);
            // ค่าซ่อม (เฉพาะรายการที่ isFix) — เป็นต้นทุนเพิ่มของร้านโทรศัพท์
            const orderRepairCost = order.items.reduce((sum, item) => {
                const fix = item.product.isFix
                    ? Number(item.product.fixPrice || 0)
                    : 0;
                return sum + item.qty * fix;
            }, 0);
            trends[key].sales += orderSales;
            trends[key].expenses += orderCost;
            trends[key].repairCost += orderRepairCost;
            // กำไร = ยอดขาย - (ต้นทุน + ค่าซ่อม)
            trends[key].profit += orderSales - orderCost - orderRepairCost;
        }
    }
    return Object.entries(trends)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, data]) => ({
        label: formatLabel(label, grouping),
        totalSales: data.sales,
        totalExpenses: data.expenses,
        totalFixPrice: data.repairCost,
        totalProfit: data.profit,
    }));
};
exports.getRevenueTrend = getRevenueTrend;
function getFormatKey(date, grouping) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    if (grouping === "year")
        return `${y}`;
    if (grouping === "month")
        return `${y}-${m}`;
    return `${y}-${m}-${d}`;
}
function formatLabel(key, grouping) {
    if (grouping === "year")
        return key;
    if (grouping === "month") {
        const [y, m] = key.split("-");
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return `${monthNames[parseInt(m) - 1]} ${y}`;
    }
    const [y, m, d] = key.split("-");
    return `${d}/${m}/${y}`;
}
