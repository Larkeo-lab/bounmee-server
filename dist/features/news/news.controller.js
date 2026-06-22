"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_format_1 = require("../../shared/utils/response-format");
const news_service_1 = require("./news.service");
const common_validate_1 = require("../../shared/validations/common.validate");
const news_validate_1 = require("./news.validate");
const newsController = {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
};
async function createNews(req, res) {
    const validatedData = news_validate_1.newsCreateSchema.parse(req.body);
    const createdBy = res.locals.payload?.userId || "system";
    const result = await (0, news_service_1.createNewsService)(validatedData, createdBy);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getAllNews(req, res) {
    const { page, limit } = common_validate_1.paginationSchema.parse(req.query);
    const { status, search, isActive, createdBy } = news_validate_1.querySchema.parse(req.query);
    const result = await (0, news_service_1.getAllNewsService)(page, limit, status, search, isActive, createdBy);
    const { news, total } = result;
    (0, response_format_1.ResponsePaginationSuccess)(res, news, page, limit, total);
}
async function getNewsById(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, news_service_1.getNewsByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateNews(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const validatedData = news_validate_1.newsUpdateSchema.parse(req.body);
    const updatedBy = res.locals.payload?.userId || "system";
    const result = await (0, news_service_1.updateNewsService)(id, validatedData, updatedBy);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteNews(req, res) {
    const { id } = common_validate_1.idSchema.parse(req.params);
    const result = await (0, news_service_1.deleteNewsService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
exports.default = newsController;
