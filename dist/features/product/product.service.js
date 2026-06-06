"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductService = exports.updateProductService = exports.getProductByIdService = exports.getProductByBarcodeService = exports.getProductsService = exports.createProductService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const bad_request_1 = require("../../shared/exceptions/bad-request");
// ✅ ไม่ต้อง import ProductStatus อีกต่อไป
// --- Product Services ---
const createProductService = async (data) => {
    if (data.barcode) {
        const existingProduct = await prisma_1.prisma.product.findFirst({
            where: {
                barcode: data.barcode,
                storeId: data.storeId,
            },
        });
        if (existingProduct) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.PRODUCT_ALREADY_EXIST, root_1.ErrorCode.PRODUCT_ALREADY_EXIST, { duplicatedField: "barcode" });
        }
    }
    const result = await prisma_1.prisma.product.create({
        data,
        include: {
            category: true,
            unit: true,
        },
    });
    return result;
};
exports.createProductService = createProductService;
const getProductsService = async (data) => {
    const result = await prisma_1.prisma.product.findMany({
        where: {
            isDelete: false, // ซ่อนสินค้าที่ถูกลบ (soft delete)
            ...(data.storeId ? { storeId: data.storeId } : {}),
            ...(data.categoryId ? { categoryId: data.categoryId } : {}),
            ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
            ...(data.isFix !== undefined ? { isFix: data.isFix } : {}),
            ...(data.productType !== undefined ? { productType: data.productType } : {}),
            // ✅ ลบ status และ tableId ออก → ย้ายไปอยู่ใน OrderItem แล้ว
            ...(data.search
                ? {
                    OR: [
                        { name: { contains: data.search, mode: "insensitive" } },
                        { barcode: { contains: data.search, mode: "insensitive" } },
                    ],
                }
                : {}),
        },
        include: {
            category: true,
            unit: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
exports.getProductsService = getProductsService;
const getProductByBarcodeService = async (barcode, storeId) => {
    const result = await prisma_1.prisma.product.findFirst({
        where: { barcode, storeId, isDelete: false },
        include: {
            category: true,
            store: true,
            unit: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getProductByBarcodeService = getProductByBarcodeService;
const getProductByIdService = async (id) => {
    const result = await prisma_1.prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            store: true,
            unit: true,
        },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getProductByIdService = getProductByIdService;
const updateProductService = async (id, data, updatedBy) => {
    const existingProduct = await prisma_1.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    if (data.barcode) {
        const conflictProduct = await prisma_1.prisma.product.findFirst({
            where: {
                barcode: data.barcode,
                storeId: existingProduct.storeId,
                NOT: { id },
            },
        });
        if (conflictProduct) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.PRODUCT_ALREADY_EXIST, root_1.ErrorCode.PRODUCT_ALREADY_EXIST, { duplicatedField: "barcode" });
        }
    }
    // Create update history if stockQty, cost, or price changed
    const isStockQtyChanged = data.stockQty !== undefined && data.stockQty !== existingProduct.stockQty;
    const isCostChanged = data.cost !== undefined && Number(data.cost) !== Number(existingProduct.cost);
    const isPriceChanged = data.price !== undefined && Number(data.price) !== Number(existingProduct.price);
    if (isStockQtyChanged || isCostChanged || isPriceChanged) {
        await prisma_1.prisma.productUpdateHistory.create({
            data: {
                productId: id,
                oldStockQty: existingProduct.stockQty,
                newStockQty: data.stockQty !== undefined ? data.stockQty : existingProduct.stockQty,
                oldCost: existingProduct.cost,
                newCost: data.cost !== undefined ? data.cost : existingProduct.cost,
                oldPrice: existingProduct.price,
                newPrice: data.price !== undefined ? data.price : existingProduct.price,
                updatedBy: updatedBy || null,
            },
        });
    }
    const result = await prisma_1.prisma.product.update({
        where: { id },
        data,
        include: {
            category: true,
            unit: true,
        },
    });
    return result;
};
exports.updateProductService = updateProductService;
const deleteProductService = async (id) => {
    const existingProduct = await prisma_1.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    // Soft delete — mark isDelete = true แทนการลบจริง
    // เพื่อไม่ให้กระทบ orderItem / productFree / productUpdateHistory ที่อ้างอิงอยู่
    // (ข้อมูลออเดอร์/ประวัติยังครบ และ FK ไม่ติด)
    await prisma_1.prisma.product.update({
        where: { id },
        data: {
            isDelete: true,
            deleteAt: new Date(),
        },
    });
    return { id, message: "Product deleted successfully" };
};
exports.deleteProductService = deleteProductService;
