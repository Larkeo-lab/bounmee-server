import { prisma } from "@config/prisma";
import { NotFoundException } from "@exceptions/not-found";
import { ErrorCode, ErrorMessages } from "@exceptions/root";
import { io } from "@src/server";

export const PublicService = {
  async getTableByQrCode(qrCode: string) {
    return {
      id: "mock-table-id",
      name: "Mock Table",
      status: "AVAILABLE",
      activeCart: [],
    };
  },

  async getProducts(storeId: string, categoryId?: string) {
    return { data: [], meta: { total: 0 }, summary: {} };
  },

  async submitOrder(data: { tableId: string; storeId: string; items: any[] }) {
    return { message: "Order submitted successfully (mocked)" };
  },
};
