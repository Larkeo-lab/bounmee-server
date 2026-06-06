"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const store_validate_1 = require("./store.validate");
const store_service_1 = require("./store.service");
const common_validate_1 = require("../../shared/validations/common.validate");
exports.storeController = {
    getStores,
    getStoreById,
    updateStore,
    deleteStore,
};
async function getStores(req, res) {
    const filter = store_validate_1.queryStore.parse(req.query);
    const { page, limit, search } = common_validate_1.paginationSchema.parse(req.query);
    const { data, total } = await (0, store_service_1.getStoresService)(search, filter, page, limit);
    (0, response_format_1.ResponsePaginationSuccess)(res, data, page, limit, total);
}
async function getStoreById(req, res) {
    const { id } = store_validate_1.storeParamsSchema.parse(req.params);
    const result = await (0, store_service_1.getStoreByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateStore(req, res) {
    const { id } = store_validate_1.storeParamsSchema.parse(req.params);
    const data = store_validate_1.updateStoreSchema.parse(req.body);
    const result = await (0, store_service_1.updateStoreService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteStore(req, res) {
    const { id } = store_validate_1.storeParamsSchema.parse(req.params);
    const result = await (0, store_service_1.deleteStoreService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
