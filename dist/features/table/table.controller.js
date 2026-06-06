"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const table_validate_1 = require("./table.validate");
const table_service_1 = require("./table.service");
exports.TableController = {
    createZone,
    getZones,
    updateZone,
    deleteZone,
    createTable,
    getTables,
    getTableById,
    updateTable,
    deleteTable,
    generateMissingQrCodes,
};
// --- ZONE ---
async function createZone(req, res) {
    const data = table_validate_1.createZoneSchema.parse(req.body);
    const result = await (0, table_service_1.createZoneService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getZones(req, res) {
    const { storeId, isActive, search } = table_validate_1.queryZoneSchema.parse(req.query);
    const result = await (0, table_service_1.getZonesService)(storeId, isActive, search);
    (0, response_format_1.ResponseManyDataSuccess)(res, result);
}
async function updateZone(req, res) {
    const { id } = table_validate_1.tableParamsSchema.parse(req.params);
    const data = table_validate_1.updateZoneSchema.parse(req.body);
    const result = await (0, table_service_1.updateZoneService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteZone(req, res) {
    const { id } = table_validate_1.tableParamsSchema.parse(req.params);
    const result = await (0, table_service_1.deleteZoneService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
// --- TABLE ---
async function createTable(req, res) {
    const data = table_validate_1.createTableSchema.parse(req.body);
    const result = await (0, table_service_1.createTableService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getTables(req, res) {
    const { storeId, zoneId, isActive, status, search } = table_validate_1.queryTableSchema.parse(req.query);
    const result = await (0, table_service_1.getTablesService)(storeId, zoneId, isActive, status, search);
    (0, response_format_1.ResponseManyDataSuccess)(res, result);
}
async function getTableById(req, res) {
    const { id } = table_validate_1.tableParamsSchema.parse(req.params);
    const result = await (0, table_service_1.getTableByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateTable(req, res) {
    const { id } = table_validate_1.tableParamsSchema.parse(req.params);
    const data = table_validate_1.updateTableSchema.parse(req.body);
    const result = await (0, table_service_1.updateTableService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteTable(req, res) {
    const { id } = table_validate_1.tableParamsSchema.parse(req.params);
    const result = await (0, table_service_1.deleteTableService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function generateMissingQrCodes(req, res) {
    const { storeId } = req.body;
    if (!storeId) {
        res.status(400).json({ success: false, message: "Store ID is required" });
        return;
    }
    const result = await (0, table_service_1.generateMissingQrCodesService)(storeId);
    (0, response_format_1.ResponseSuccess)(res, result);
}
