"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertDefaultUnits = exports.DEFAULT_UNITS = void 0;
const prisma_1 = require("../../config/prisma");
exports.DEFAULT_UNITS = [
    { name: "ຊິ້ນ" },
    { name: "ແກ້ວ" },
    { name: "ປ໋ອງ" },
    { name: "ຂວດ" },
    { name: "ກ່ອງ" },
    { name: "ຖົງ" },
    { name: "ກິໂລ" },
    { name: "ລິດ" },
    { name: "ຊ່ອງ" },
];
/**
 * Inserts default units for a new store.
 * This is typically called during store registration.
 */
const insertDefaultUnits = async (storeId) => {
    try {
        // Check if store already has units to avoid duplication
        const count = await prisma_1.prisma.productUnit.count({
            where: { storeId },
        });
        if (count > 0)
            return;
        // Use name as the primary identifier (localized as needed by the user later)
        const data = exports.DEFAULT_UNITS.map((unit) => ({
            name: unit.name,
            storeId,
            productId: null, // Global store-level unit
            isActive: true,
        }));
        await prisma_1.prisma.productUnit.createMany({
            data,
            skipDuplicates: true,
        });
        console.log(`Default units inserted for store: ${storeId}`);
    }
    catch (error) {
        console.error(`Failed to insert default units for store ${storeId}:`, error);
    }
};
exports.insertDefaultUnits = insertDefaultUnits;
