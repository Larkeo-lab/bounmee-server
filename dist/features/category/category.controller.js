"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const category_validate_1 = require("./category.validate");
const category_service_1 = require("./category.service");
exports.categoryController = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
async function createCategory(req, res) {
    const data = category_validate_1.createCategorySchema.parse(req.body);
    const result = await (0, category_service_1.createCategoryService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function getCategories(req, res) {
    const storeId = req.query.storeId;
    const result = await (0, category_service_1.getCategoriesService)(storeId);
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, result.length, result.length);
}
async function getCategoryById(req, res) {
    const { id } = category_validate_1.categoryParamsSchema.parse(req.params);
    const result = await (0, category_service_1.getCategoryByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateCategory(req, res) {
    const { id } = category_validate_1.categoryParamsSchema.parse(req.params);
    const data = category_validate_1.updateCategorySchema.parse(req.body);
    const result = await (0, category_service_1.updateCategoryService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteCategory(req, res) {
    const { id } = category_validate_1.categoryParamsSchema.parse(req.params);
    const result = await (0, category_service_1.deleteCategoryService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
