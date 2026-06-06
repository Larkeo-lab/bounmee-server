"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicService = void 0;
exports.PublicService = {
    async getTableByQrCode(qrCode) {
        return {
            id: "mock-table-id",
            name: "Mock Table",
            status: "AVAILABLE",
            activeCart: [],
        };
    },
    async getProducts(storeId, categoryId) {
        return { data: [], meta: { total: 0 }, summary: {} };
    },
    async submitOrder(data) {
        return { message: "Order submitted successfully (mocked)" };
    },
};
