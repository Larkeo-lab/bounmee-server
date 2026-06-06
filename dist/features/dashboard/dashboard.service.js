"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardService = void 0;
const prisma_1 = require("../../config/prisma");
const dashboard_helper_1 = require("./dashboard.helper");
const getDashboardService = async (data) => {
    const { storeId, startDate, endDate } = data;
    const where = (0, dashboard_helper_1.getDashboardWhere)(storeId, startDate, endDate);
    // Use the same date range for expenses
    const whereExpense = {
        ...(storeId ? { storeId } : {}),
        ...(where.createdAt ? { createdAt: where.createdAt } : {}),
    };
    const [totalSalesAggregate, totalEmployee, paymentChannelData, topSellingProductsData, totalMenu, revenueTrend, upcomingDebtsData, totalFreeAggregate,] = await Promise.all([
        prisma_1.prisma.order.aggregate({
            where,
            _sum: {
                totalAmount: true,
                discountAmount: true,
                debtAmount: true,
                transferAmount: true,
                cashAmount: true,
            },
        }),
        prisma_1.prisma.employee.count({
            where: {
                storeId,
            },
        }),
        prisma_1.prisma.order.groupBy({
            by: ["paymentMethod", "bankId"],
            where,
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        }),
        prisma_1.prisma.orderItem.groupBy({
            by: ["productId"],
            where: {
                order: where,
            },
            _sum: {
                qty: true,
                subTotal: true,
            },
            orderBy: {
                _sum: {
                    qty: "desc",
                },
            },
            take: 5,
        }),
        prisma_1.prisma.product.count({
            where: {
                storeId,
                isDelete: false,
            },
        }),
        (0, dashboard_helper_1.getRevenueTrend)(where, data),
        prisma_1.prisma.order.findMany({
            where: {
                ...where,
                isDebt: true,
                dueDate: { not: null },
            },
            include: {
                member: {
                    select: { name: true, phone: true },
                },
            },
            orderBy: {
                dueDate: "asc",
            },
            take: 5,
        }),
        // รวมราคาของแถมทั้งหมด (ตาม order ที่อยู่ในช่วง + ไม่ถูกลบ)
        prisma_1.prisma.productFree.aggregate({
            where: {
                order: where,
            },
            _sum: {
                totalPrice: true,
                amount: true,
            },
        }),
    ]);
    // Aggregate totals from the trend data for consistency
    const totalSales = Number(totalSalesAggregate._sum.totalAmount || 0);
    const totalExpensesAmount = revenueTrend.reduce((sum, t) => sum + t.totalExpenses, 0);
    const totalFixPrice = revenueTrend.reduce((sum, t) => sum + t.totalFixPrice, 0);
    const totalProfit = revenueTrend.reduce((sum, t) => sum + t.totalProfit, 0);
    const totalFree = Number(totalFreeAggregate._sum.totalPrice || 0);
    const amoutFree = Number(totalFreeAggregate._sum.amount || 0);
    // Get product names for top selling products
    const productIds = topSellingProductsData.map((item) => item.productId);
    const bankIds = paymentChannelData
        .filter((item) => item.bankId)
        .map((item) => item.bankId);
    const [products, banks] = await Promise.all([
        prisma_1.prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                unit: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma_1.prisma.bank.findMany({
            where: {
                id: { in: bankIds },
            },
            select: {
                id: true,
                name: true,
                logoUrl: true,
            },
        }),
    ]);
    // 5. Separate Payment Channel Logic (Split Cash and Transfer)
    const paymentChannels = [];
    // Add Cash total from all orders
    const totalCashAmount = Number(totalSalesAggregate._sum.cashAmount || 0);
    if (totalCashAmount > 0) {
        paymentChannels.push({
            method: "CASH",
            totalSales: totalCashAmount,
            count: paymentChannelData.find((p) => p.paymentMethod === "CASH")?._count.id ||
                0,
            logoUrl: null,
        });
    }
    // Add Debt total
    const totalDebtAmount = Number(totalSalesAggregate._sum.debtAmount || 0);
    if (totalDebtAmount > 0) {
        paymentChannels.push({
            method: "DEBT",
            totalSales: totalDebtAmount,
            count: 0,
            logoUrl: null,
        });
    }
    // Group transfer amounts by bank using a single query
    const bankTransferData = await prisma_1.prisma.order.groupBy({
        by: ["bankId"],
        where: {
            ...where,
            paymentMethod: { in: ["TRANSFER", "TRANSFER_CASH", "CREDIT_CARD"] },
        },
        _sum: {
            transferAmount: true,
            totalAmount: true,
        },
        _count: {
            id: true,
        },
    });
    bankTransferData.forEach((item) => {
        const bank = banks.find((b) => b.id === item.bankId);
        let method = "TRANSFER";
        if (bank) {
            method = bank.name;
        }
        // For TRANSFER_CASH, we only want the transferAmount part
        // For pure TRANSFER, totalAmount is equal to transferAmount
        // We use transferAmount to be safe as it represents the non-cash part
        const totalSales = Number(item._sum.transferAmount || 0);
        if (totalSales > 0) {
            paymentChannels.push({
                method,
                totalSales,
                count: item._count.id,
                logoUrl: bank?.logoUrl || null,
            });
        }
    });
    const paymentChannel = paymentChannels;
    const topSellingProducts = topSellingProductsData.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
            name: product?.name || "Unknown",
            description: product?.description || "",
            image: product?.image || "",
            qty: item._sum.qty || 0,
            totalSales: Number(item._sum.subTotal || 0),
            unitName: product?.unit?.name || "",
        };
    });
    return {
        summary: {
            totalSales,
            totalExpenses: totalExpensesAmount,
            totalFixPrice,
            totalProfit,
            totalEmployee,
            totalMenu,
            totalFree,
            amoutFree,
            totalDiscount: Number(totalSalesAggregate._sum.discountAmount || 0),
            totalDebt: Number(totalSalesAggregate._sum.debtAmount || 0),
            totalTransfer: Number(totalSalesAggregate._sum.transferAmount || 0),
            totalCash: Number(totalSalesAggregate._sum.cashAmount || 0),
        },
        revenueTrend,
        paymentChannel,
        topSellingProducts,
        upcomingDebts: (upcomingDebtsData || []).map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            totalAmount: Number(order.totalAmount),
            debtAmount: Number(order.debtAmount),
            dueDate: order.dueDate,
            paymentStatus: order.paymentStatus,
            memberName: order.member?.name || "Unknown",
            memberPhone: order.member?.phone || "",
        })),
    };
};
exports.getDashboardService = getDashboardService;
