"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProductUpdateHistoryWhereInput = void 0;
const buildProductUpdateHistoryWhereInput = (productId, storeId, search, startDate, endDate) => {
    return {
        ...(productId && { productId }),
        ...(storeId && {
            product: {
                storeId,
            },
        }),
        ...(search && {
            OR: [{ product: { name: { contains: search, mode: "insensitive" } } }],
        }),
        ...(startDate && { updatedAt: { gte: startDate } }),
        ...(endDate && { updatedAt: { lte: endDate } }),
    };
};
exports.buildProductUpdateHistoryWhereInput = buildProductUpdateHistoryWhereInput;
