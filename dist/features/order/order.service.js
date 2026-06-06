"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportsByAdminService = exports.deleteOrderService = exports.updateOrderItemsService = exports.updateOrderPaymentStatusService = exports.getOrderByIdService = exports.getOrdersService = exports.createOrderService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const bad_request_1 = require("../../shared/exceptions/bad-request");
const order_helper_1 = require("./order.helper");
const createOrderService = async (data) => {
    const { items, productFrees = [], documents = [], ...orderData } = data;
    let retries = 3;
    while (retries > 0) {
        try {
            // Wrap in a transaction to handle stock deduction and order creation
            const result = await prisma_1.prisma.$transaction(async (tx) => {
                // 0. Generate Unique Order Number (Inside Transaction)
                const orderNumber = await (0, order_helper_1.generateOrderNumber)(tx, orderData.storeId);
                // 1. Bulk Fetch Products for validation and stock check
                //    (รวม items ปกติ + ของแถม)
                const productIds = [
                    ...items.map((i) => i.productId),
                    ...productFrees.map((f) => f.productId),
                ];
                const products = await tx.product.findMany({
                    where: { id: { in: productIds } },
                });
                const productMap = new Map(products.map((p) => [p.id, p]));
                // 2. Process Order Items, Check Stock, and Prepare Updates
                const processedItems = [];
                const updatePromises = [];
                for (const item of items) {
                    const product = productMap.get(item.productId);
                    if (!product) {
                        throw new not_found_1.NotFoundException(root_1.ErrorMessages.PRODUCT_NOT_FOUND, root_1.ErrorCode.PRODUCT_NOT_FOUND, { productId: item.productId });
                    }
                    if (product.stockQty < item.qty) {
                        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.INSUFFICIENT_STOCK, root_1.ErrorCode.INSUFFICIENT_STOCK, {
                            productId: item.productId,
                            productName: product.name,
                            availableStock: product.stockQty,
                            requested: item.qty,
                        });
                    }
                    // Prepare decrement stock promise
                    updatePromises.push(tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stockQty: {
                                decrement: item.qty,
                            },
                        },
                    }));
                    processedItems.push({
                        productId: item.productId,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        subTotal: item.subTotal,
                        note: item.note,
                        unitName: item.unitName,
                    });
                }
                // 2b. ✨ ตรวจสอบ stock ของของแถม + เตรียม decrement
                const processedFrees = [];
                for (const free of productFrees) {
                    const product = productMap.get(free.productId);
                    if (!product) {
                        throw new not_found_1.NotFoundException(root_1.ErrorMessages.PRODUCT_NOT_FOUND, root_1.ErrorCode.PRODUCT_NOT_FOUND, { productId: free.productId });
                    }
                    // นับ stock ที่ใช้จาก items ปกติของ product เดียวกันด้วย
                    const alreadyUsed = items
                        .filter((i) => i.productId === free.productId)
                        .reduce((acc, i) => acc + i.qty, 0);
                    if (product.stockQty < alreadyUsed + free.amount) {
                        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.INSUFFICIENT_STOCK, root_1.ErrorCode.INSUFFICIENT_STOCK, {
                            productId: free.productId,
                            productName: product.name,
                            availableStock: product.stockQty - alreadyUsed,
                            requested: free.amount,
                        });
                    }
                    updatePromises.push(tx.product.update({
                        where: { id: free.productId },
                        data: { stockQty: { decrement: free.amount } },
                    }));
                    processedFrees.push({
                        productId: free.productId,
                        amount: free.amount,
                        price: free.price,
                        totalPrice: free.totalPrice,
                        storeId: orderData.storeId,
                    });
                }
                // 3. Execute all stock updates in parallel (within the transaction)
                if (updatePromises.length > 0) {
                    await Promise.all(updatePromises);
                }
                // 3. Create Order
                const createdOrder = await tx.order.create({
                    data: {
                        ...orderData,
                        orderNumber,
                        items: {
                            create: processedItems,
                        },
                        productFrees: {
                            create: processedFrees,
                        },
                        documents: {
                            create: documents.map((d) => ({
                                name: d.name,
                                imageUrl: d.imageUrl || null,
                                description: d.description || null,
                                storeId: orderData.storeId,
                            })),
                        },
                    },
                    include: {
                        items: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                        barcode: true,
                                        unit: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        store: {
                            select: {
                                name: true,
                            },
                        },
                        employee: {
                            select: {
                                name: true,
                            },
                        },
                        member: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                            },
                        },
                        documents: {
                            select: { id: true, name: true, imageUrl: true, description: true },
                        },
                        productFrees: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                        barcode: true,
                                        unit: { select: { id: true, name: true } },
                                    },
                                },
                            },
                        },
                    },
                });
                // 4. If tableId is provided, clear the table session atomically
                if (orderData.tableId) {
                    // ✨ Clear active cart items
                    await tx.activeCartItem.deleteMany({
                        where: { tableId: orderData.tableId },
                    });
                    // ✨ Archive chat messages for this table session
                    await tx.chatMessage.updateMany({
                        where: { tableId: orderData.tableId, isArchived: false },
                        data: { isArchived: true },
                    });
                    // ✨ Update table status to AVAILABLE
                    await tx.table.update({
                        where: { id: orderData.tableId },
                        data: { status: "AVAILABLE" },
                    });
                }
                return createdOrder;
            }, {
                timeout: 30000, // ເພີ່ມເປັນ 30 ວິນາທີ ເນື່ອງຈາກຖານຂໍ້ມູນຢູ່ຕ່າງປະເທດ (Latency ສູງ)
            });
            return result;
        }
        catch (error) {
            // If it's a unique constraint violation on orderNumber, retry
            if (error.code === "P2002" &&
                error.meta?.target?.includes("orderNumber")) {
                retries--;
                if (retries === 0)
                    throw error;
                // Wait a bit before retrying to let other transaction finish
                await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
                continue;
            }
            throw error;
        }
    }
    throw new Error("Unexpected end of createOrderService");
};
exports.createOrderService = createOrderService;
const getOrdersService = async (filters) => {
    const { page, limit, ...queryFilters } = filters;
    const where = (0, order_helper_1.getOrderWhere)(queryFilters);
    const [data, total, summary] = await Promise.all([
        prisma_1.prisma.order.findMany({
            where,
            include: {
                _count: {
                    select: { items: true },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                barcode: true,
                                price: true,
                                image: true,
                                unit: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                employee: {
                    select: { name: true },
                },
                bank: {
                    select: { name: true, logoUrl: true },
                },
                table: {
                    select: { name: true },
                },
                member: {
                    select: { id: true, name: true, phone: true },
                },
                documents: {
                    select: { id: true, name: true, imageUrl: true, description: true },
                },
                productFrees: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                barcode: true,
                                unit: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma_1.prisma.order.count({ where }),
        prisma_1.prisma.order.aggregate({
            where,
            _sum: {
                totalAmount: true,
                discountAmount: true,
                debtAmount: true,
                transferAmount: true,
                cashAmount: true,
                creditCardAmount: true,
                receivedAmount: true,
            },
        }),
    ]);
    // Aggregate cash and transfer specifically
    const [cashSummary, transferSummary, bankGroups] = await Promise.all([
        prisma_1.prisma.order.aggregate({
            where: { ...where, paymentMethod: "CASH" },
            _sum: { totalAmount: true },
        }),
        prisma_1.prisma.order.aggregate({
            where: { ...where, paymentMethod: "TRANSFER" },
            _sum: { totalAmount: true },
        }),
        prisma_1.prisma.order.groupBy({
            where: { ...where, paymentMethod: "TRANSFER" },
            by: ["bankId"],
            _sum: {
                totalAmount: true,
            },
        }),
    ]);
    // Fetch bank details for the summaries
    const transfersByBank = await Promise.all(bankGroups.map(async (group) => {
        const bank = group.bankId
            ? await prisma_1.prisma.bank.findUnique({
                where: { id: group.bankId },
                select: { name: true, logoUrl: true },
            })
            : null;
        return {
            name: bank?.name || "ບໍ່ລະບຸທະນາຄານ",
            logoUrl: bank?.logoUrl,
            total: group._sum.totalAmount || 0,
        };
    }));
    return {
        data,
        total,
        summary: {
            totalAmount: summary._sum.totalAmount || 0,
            totalDiscount: summary._sum.discountAmount || 0,
            totalDebt: summary._sum.debtAmount || 0,
            totalPaidAmount: summary._sum.receivedAmount || 0,
            totalTransfer: summary._sum.transferAmount || 0,
            totalCash: summary._sum.cashAmount || 0,
            totalCreditCard: summary._sum.creditCardAmount || 0,
            totalCashMethod: cashSummary._sum.totalAmount || 0, // Original logic for single method CASH
            totalTransferMethod: transferSummary._sum.totalAmount || 0, // Original logic for single method TRANSFER
            transfersByBank,
        },
    };
};
exports.getOrdersService = getOrdersService;
const getOrderByIdService = async (id) => {
    const result = await prisma_1.prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            store: true,
            employee: {
                select: { name: true },
            },
            member: true,
            bank: true,
            documents: true,
            productFrees: {
                include: { product: true },
            },
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getOrderByIdService = getOrderByIdService;
const updateOrderPaymentStatusService = async (id, data, userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { employeeId: true, storeId: true, role: true },
    });
    if (!user) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.USER_NOT_FOUND, root_1.ErrorCode.USER_NOT_FOUND);
    }
    const order = await prisma_1.prisma.order.findUnique({
        where: { id },
    });
    if (!order) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return await prisma_1.prisma.$transaction(async (tx) => {
        const repaymentAmount = data.paymentStatus === "PAID"
            ? Number(order.debtAmount)
            : (data.receivedAmount ?? 0);
        const isCashPayment = data.paymentMethod === "CASH" ||
            (!data.paymentMethod && order.paymentMethod === "CASH");
        const isTransferPayment = data.paymentMethod === "TRANSFER" ||
            (!data.paymentMethod && order.paymentMethod === "TRANSFER");
        // 2. Update order status and amounts
        const updatedOrder = await tx.order.update({
            where: { id },
            data: {
                paymentStatus: data.paymentStatus,
                receivedAmount: {
                    increment: repaymentAmount,
                },
                debtAmount: {
                    decrement: repaymentAmount,
                },
                ...(isCashPayment
                    ? {
                        cashAmount: {
                            increment: repaymentAmount,
                        },
                    }
                    : {}),
                ...(isTransferPayment
                    ? {
                        transferAmount: {
                            increment: repaymentAmount,
                        },
                    }
                    : {}),
                paymentMethod: data.paymentMethod || order.paymentMethod,
                bankId: data.bankId || order.bankId,
            },
        });
        return updatedOrder;
    });
};
exports.updateOrderPaymentStatusService = updateOrderPaymentStatusService;
const updateOrderItemsService = async (id, data) => {
    const { items, productFrees = [], totalAmount, discountAmount, isDiscount, discountPercent, receivedAmount, change, paymentMethod, cashAmount, transferAmount, bankId, paymentStatus, isDebt, debtAmount, memberId, documents = [], transferSlip, dueDate, } = data;
    return await prisma_1.prisma.$transaction(async (tx) => {
        // 1. Fetch existing order with items + free items
        const existingOrder = await tx.order.findUnique({
            where: { id },
            include: { items: true, productFrees: true },
        });
        if (!existingOrder) {
            throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
        }
        // 2. Compute net stock delta per product (oldQty + oldFreeAmount) - (newQty + newFreeAmount)
        //    Positive delta = stock to restore, negative = stock to deduct
        const stockDeltas = new Map();
        for (const oldItem of existingOrder.items) {
            stockDeltas.set(oldItem.productId, (stockDeltas.get(oldItem.productId) || 0) + oldItem.qty);
        }
        for (const oldFree of existingOrder.productFrees) {
            stockDeltas.set(oldFree.productId, (stockDeltas.get(oldFree.productId) || 0) + oldFree.amount);
        }
        for (const newItem of items) {
            stockDeltas.set(newItem.productId, (stockDeltas.get(newItem.productId) || 0) - newItem.qty);
        }
        for (const newFree of productFrees) {
            stockDeltas.set(newFree.productId, (stockDeltas.get(newFree.productId) || 0) - newFree.amount);
        }
        // 3. Verify stock availability for products that need deduction
        const productIds = Array.from(stockDeltas.keys());
        const products = await tx.product.findMany({
            where: { id: { in: productIds } },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const [productId, delta] of stockDeltas) {
            if (delta >= 0)
                continue; // restoring stock; safe
            const needed = -delta;
            const product = productMap.get(productId);
            if (!product) {
                throw new not_found_1.NotFoundException(root_1.ErrorMessages.PRODUCT_NOT_FOUND, root_1.ErrorCode.PRODUCT_NOT_FOUND, { productId });
            }
            if (product.stockQty < needed) {
                throw new bad_request_1.BadRequestException(root_1.ErrorMessages.INSUFFICIENT_STOCK, root_1.ErrorCode.INSUFFICIENT_STOCK, {
                    productId,
                    productName: product.name,
                    availableStock: product.stockQty,
                    requested: needed,
                });
            }
        }
        // 4. Apply stock deltas
        await Promise.all(Array.from(stockDeltas.entries())
            .filter(([, delta]) => delta !== 0)
            .map(([productId, delta]) => tx.product.update({
            where: { id: productId },
            data: { stockQty: { increment: delta } },
        })));
        // 5. Replace order items + product-frees
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.productFree.deleteMany({ where: { orderId: id } });
        await tx.document.deleteMany({ where: { orderId: id } });
        // 6. Update order totals + insert new items
        const updatedOrder = await tx.order.update({
            where: { id },
            data: {
                totalAmount,
                ...(discountAmount !== undefined && discountAmount !== null
                    ? { discountAmount }
                    : {}),
                ...(isDiscount !== undefined && isDiscount !== null
                    ? { isDiscount }
                    : {}),
                ...(discountPercent !== undefined && discountPercent !== null
                    ? { discountPercent }
                    : {}),
                ...(receivedAmount !== undefined ? { receivedAmount } : {}),
                ...(change !== undefined ? { change } : {}),
                ...(paymentMethod !== undefined ? { paymentMethod } : {}),
                ...(cashAmount !== undefined && cashAmount !== null
                    ? { cashAmount }
                    : {}),
                ...(transferAmount !== undefined && transferAmount !== null
                    ? { transferAmount }
                    : {}),
                ...(bankId !== undefined ? { bankId } : {}),
                ...(paymentStatus !== undefined ? { paymentStatus } : {}),
                ...(isDebt !== undefined && isDebt !== null ? { isDebt } : {}),
                ...(debtAmount !== undefined && debtAmount !== null
                    ? { debtAmount }
                    : {}),
                ...(memberId !== undefined ? { memberId } : {}),
                ...(transferSlip !== undefined ? { transferSlip } : {}),
                ...(dueDate !== undefined
                    ? { dueDate: dueDate ? new Date(dueDate) : null }
                    : {}),
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        qty: item.qty,
                        unitPrice: item.unitPrice,
                        subTotal: item.subTotal,
                        status: item.status,
                        note: item.note,
                        unitName: item.unitName,
                    })),
                },
                productFrees: {
                    create: productFrees.map((free) => ({
                        productId: free.productId,
                        amount: free.amount,
                        price: free.price,
                        totalPrice: free.totalPrice,
                        storeId: existingOrder.storeId,
                    })),
                },
                documents: {
                    create: documents.map((d) => ({
                        name: d.name,
                        imageUrl: d.imageUrl || null,
                        description: d.description || null,
                        storeId: existingOrder.storeId,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                barcode: true,
                                price: true,
                                image: true,
                                unit: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
                employee: { select: { name: true } },
                bank: { select: { name: true, logoUrl: true } },
                table: { select: { id: true, name: true } },
                member: { select: { id: true, name: true, phone: true } },
                documents: {
                    select: { id: true, name: true, imageUrl: true, description: true },
                },
                productFrees: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                barcode: true,
                                unit: { select: { id: true, name: true } },
                            },
                        },
                    },
                },
            },
        });
        return updatedOrder;
    }, { timeout: 30000 });
};
exports.updateOrderItemsService = updateOrderItemsService;
// Soft delete order — mark isDelete = true + เก็บเวลาที่ลบ (deleteAt)
// ไม่ลบ row จริง เพื่อคงข้อมูลออเดอร์/รายการไว้
const deleteOrderService = async (id) => {
    const existingOrder = await prisma_1.prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.order.update({
        where: { id },
        data: { isDelete: true, deleteAt: new Date() },
    });
    return { id, message: "Order deleted successfully" };
};
exports.deleteOrderService = deleteOrderService;
// admin
const getReportsByAdminService = async (storeId, startDate, endDate, page = 1, limit = 10) => {
    // ============================
    // 1. ส້າງ filter condition
    // ============================
    const where = { storeId, isDelete: false };
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
    // ============================
    // 2. ດຶງ orders ທັງໝົດ (select ສະເພາະ field ທີ່ຕ້ອງການ)
    //    ເພື່ອນຳໄປ group ເປັນລາຍວັນ
    // ============================
    const allOrders = await prisma_1.prisma.order.findMany({
        where,
        select: {
            id: true,
            totalAmount: true,
            transferAmount: true,
            cashAmount: true,
            creditCardAmount: true,
            discountAmount: true,
            debtAmount: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    // ============================
    // 3. ດຶງ orderItems + product.cost
    //    ເພື່ອຄຳນວນຕົ້ນທຶນ ແລະ ກຳໄລ
    // ============================
    const allCostItems = await prisma_1.prisma.orderItem.findMany({
        where: { order: where },
        select: {
            orderId: true,
            qty: true,
            product: {
                select: { cost: true },
            },
        },
    });
    // ============================
    // 4. ຈັດກຸ່ມຕົ້ນທຶນ ຕາມ orderId
    //    { orderId: totalCost }
    // ============================
    const costByOrderId = {};
    for (const item of allCostItems) {
        const cost = Number(item.product?.cost || 0) * item.qty;
        costByOrderId[item.orderId] = (costByOrderId[item.orderId] || 0) + cost;
    }
    // ============================
    // 5. ຈັດກຸ່ມ orders ເປັນລາຍວັນ
    //    key = "2026-05-17"
    // ============================
    const dailyMap = {};
    for (const order of allOrders) {
        const dateKey = order.createdAt.toISOString().split("T")[0]; // "2026-05-17"
        const orderCost = costByOrderId[order.id] || 0;
        if (!dailyMap[dateKey]) {
            dailyMap[dateKey] = {
                date: dateKey,
                orderCount: 0,
                totalAmount: 0,
                totalDiscount: 0,
                totalDebt: 0,
                totalTransfer: 0,
                totalCash: 0,
                totalCreditCard: 0,
                totalCost: 0,
            };
        }
        const day = dailyMap[dateKey];
        day.orderCount += 1;
        day.totalAmount += Number(order.totalAmount || 0);
        day.totalDiscount += Number(order.discountAmount || 0);
        day.totalDebt += Number(order.debtAmount || 0);
        day.totalTransfer += Number(order.transferAmount || 0);
        day.totalCash += Number(order.cashAmount || 0);
        day.totalCreditCard += Number(order.creditCardAmount || 0);
        day.totalCost += orderCost;
    }
    // ============================
    // 6. ແປງເປັນ array, ຄຳນວນກຳໄລ, ຈັດລຳດັບ ແລະ pagination
    // ============================
    const allDays = Object.values(dailyMap)
        .map((day) => ({
        ...day,
        profit: day.totalAmount - day.totalCost,
    }))
        .sort((a, b) => b.date.localeCompare(a.date)); // ລ່າສຸດກ່ອນ
    const total = allDays.length; // ຈຳນວນວັນທັງໝົດ
    const data = allDays.slice((page - 1) * limit, page * limit); // ຕັດຕາມ page
    // ============================
    // 7. Summary ລວມທັງໝົດ (ທຸກວັນ ທຸກ order)
    // ============================
    const summary = allDays.reduce((acc, day) => ({
        totalOrders: acc.totalOrders + day.orderCount,
        totalDays: total,
        totalAmount: acc.totalAmount + day.totalAmount,
        totalDiscount: acc.totalDiscount + day.totalDiscount,
        totalDebt: acc.totalDebt + day.totalDebt,
        totalTransfer: acc.totalTransfer + day.totalTransfer,
        totalCash: acc.totalCash + day.totalCash,
        totalCreditCard: acc.totalCreditCard + day.totalCreditCard,
        totalCost: acc.totalCost + day.totalCost,
        profitTotal: acc.profitTotal + day.profit,
    }), {
        totalOrders: 0,
        totalDays: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalDebt: 0,
        totalTransfer: 0,
        totalCash: 0,
        totalCreditCard: 0,
        totalCost: 0,
        profitTotal: 0,
    });
    return {
        data,
        total,
        summary,
    };
};
exports.getReportsByAdminService = getReportsByAdminService;
