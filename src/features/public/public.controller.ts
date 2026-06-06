import type { Request, Response } from "express";
import {
  ResponseSuccess,
  ResponseManyDataSuccess,
} from "@src/shared/utils/response-format";
import { PublicService } from "./public.service";
import z from "zod";

const QrSchema = z.object({ qrCode: z.string() });
const StoreSchema = z.object({ storeId: z.string().uuid() });
const OrderSchema = z.object({
  tableId: z.string(),
  storeId: z.string(),
  items: z.array(
    z
      .object({
        id: z.string(),
        name: z.string(),
        price: z.coerce.number(),
        quantity: z.coerce.number(),
        image: z.string().nullable().optional(),
        stockQty: z.coerce.number(),
        status: z.string().optional(),
        note: z.string().nullable().optional(),
      })
      .passthrough(),
  ),
});

async function getTableByQr(req: Request, res: Response) {
  try {
    const { qrCode } = QrSchema.parse(req.params);
    const result = await PublicService.getTableByQrCode(qrCode);
    ResponseSuccess(res, result);
  } catch (error: any) {
    console.error(
      `[PublicController] getTableByQr Error for QR: ${req.params.qrCode}`,
      error.message || error,
    );
    throw error;
  }
}

async function getPublicProducts(req: Request, res: Response) {
  try {
    const { storeId } = StoreSchema.parse(req.params);
    const categoryId = req.query.categoryId as string;
    const result = await PublicService.getProducts(storeId, categoryId);
    ResponseManyDataSuccess(res, result.data);
  } catch (error: any) {
    console.error(
      `[PublicController] getPublicProducts Error for Store: ${req.params.storeId}`,
      error.message || error,
    );
    throw error;
  }
}

async function submitCustomerOrder(req: Request, res: Response) {
  console.log("Incoming order body:", JSON.stringify(req.body, null, 2));
  try {
    const data = OrderSchema.parse(req.body);
    const result = await PublicService.submitOrder(data);
    ResponseSuccess(res, result);
  } catch (error: any) {
    console.error(
      "[PublicController] submitCustomerOrder Error:",
      error.message || error,
    );
    throw error;
  }
}

export const PublicController = {
  getTableByQr,
  getPublicProducts,
  submitCustomerOrder,
};
