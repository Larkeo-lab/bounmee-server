"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMissingQrCodesService = exports.deleteTableService = exports.updateTableService = exports.createTableService = exports.getTableByIdService = exports.getTablesService = exports.deleteZoneService = exports.updateZoneService = exports.createZoneService = exports.getZonesService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const crypto_1 = __importDefault(require("crypto"));
// --- ZONE SERVICES ---
const getZonesService = async (storeId, isActive, search) => {
    const where = {};
    if (storeId)
        where.storeId = storeId;
    if (isActive !== undefined)
        where.isActive = isActive;
    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }
    return prisma_1.prisma.zone.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { tables: true } },
        },
    });
};
exports.getZonesService = getZonesService;
const createZoneService = async (data) => {
    return prisma_1.prisma.zone.create({ data });
};
exports.createZoneService = createZoneService;
const updateZoneService = async (id, data) => {
    const zone = await prisma_1.prisma.zone.findUnique({ where: { id } });
    if (!zone)
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    return prisma_1.prisma.zone.update({ where: { id }, data });
};
exports.updateZoneService = updateZoneService;
const deleteZoneService = async (id) => {
    const zone = await prisma_1.prisma.zone.findUnique({ where: { id } });
    if (!zone)
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    return prisma_1.prisma.zone.delete({ where: { id } });
};
exports.deleteZoneService = deleteZoneService;
// --- TABLE SERVICES ---
const getTablesService = async (storeId, zoneId, isActive, status, search) => {
    const where = {};
    if (storeId)
        where.storeId = storeId;
    if (zoneId)
        where.zoneId = zoneId;
    if (isActive !== undefined)
        where.isActive = isActive;
    if (status)
        where.status = status;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { qrCode: { contains: search, mode: "insensitive" } },
        ];
    }
    const tables = await prisma_1.prisma.table.findMany({
        where,
        orderBy: [{ zoneId: "asc" }, { name: "asc" }],
        include: {
            zone: { select: { name: true } },
            activeCartItems: true,
        },
    });
    // Map activeCartItems to activeCart for frontend compatibility
    return tables.map((t) => {
        const { activeCartItems, ...rest } = t;
        return {
            ...rest,
            activeCart: (activeCartItems || []).map((item) => ({
                ...item,
                id: item.productId, // Re-map to the product ID expected by frontend
                timestamp: item.timestamp ? Number(item.timestamp) : undefined,
            })),
        };
    });
};
exports.getTablesService = getTablesService;
const getTableByIdService = async (id) => {
    const table = await prisma_1.prisma.table.findUnique({
        where: { id },
        include: {
            zone: true,
            activeCartItems: true,
        },
    });
    if (!table)
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    const { activeCartItems, ...rest } = table;
    return {
        ...rest,
        activeCart: (activeCartItems || []).map((item) => ({
            ...item,
            id: item.productId,
            timestamp: item.timestamp ? Number(item.timestamp) : undefined,
        })),
    };
};
exports.getTableByIdService = getTableByIdService;
const createTableService = async (data) => {
    if (!data.qrCode) {
        const uniqueId = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
        data.qrCode = `TB-${uniqueId}`;
    }
    return prisma_1.prisma.table.create({ data });
};
exports.createTableService = createTableService;
const updateTableService = async (id, data) => {
    const table = await prisma_1.prisma.table.findUnique({ where: { id } });
    if (!table)
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    // 📦 Archive chat if table becomes available (session ends)
    if (data.status === "AVAILABLE") {
        await prisma_1.prisma.chatMessage.updateMany({
            where: { tableId: id, isArchived: false },
            data: { isArchived: true },
        });
        // 🧹 Clear active cart items
        await prisma_1.prisma.activeCartItem.deleteMany({
            where: { tableId: id },
        });
    }
    return prisma_1.prisma.table.update({ where: { id }, data });
};
exports.updateTableService = updateTableService;
const deleteTableService = async (id) => {
    const table = await prisma_1.prisma.table.findUnique({ where: { id } });
    if (!table)
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    return prisma_1.prisma.table.delete({ where: { id } });
};
exports.deleteTableService = deleteTableService;
const generateMissingQrCodesService = async (storeId) => {
    const tables = await prisma_1.prisma.table.findMany({
        where: { storeId, qrCode: null },
    });
    const updates = tables.map((table) => {
        const uniqueId = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
        return prisma_1.prisma.table.update({
            where: { id: table.id },
            data: { qrCode: `TB-${uniqueId}` },
        });
    });
    await prisma_1.prisma.$transaction(updates);
    return { processed: tables.length, message: "QR Codes generated successfully" };
};
exports.generateMissingQrCodesService = generateMissingQrCodesService;
