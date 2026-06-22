"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const authorize_1 = require("../../shared/middleware/authorize");
const express_1 = require("express");
const news_controller_1 = __importDefault(require("./news.controller"));
const router = (0, express_1.Router)();
// Any police role may create/manage news
const policeRoles = (0, authorize_1.requireUserType)([
    "POLICE_DEPARTMENT",
    "DISTRICT_POLICE",
    "VILLAGE_CHIEF",
]);
// === News CRUD Routes (all require auth) ===
router.post("/", auth_middleware_1.authMiddleware, policeRoles, (0, error_handler_1.errorHandler)(news_controller_1.default.createNews));
router.get("/", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(news_controller_1.default.getAllNews));
router.get("/:id", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(news_controller_1.default.getNewsById));
router.put("/:id", auth_middleware_1.authMiddleware, policeRoles, (0, error_handler_1.errorHandler)(news_controller_1.default.updateNews));
router.delete("/:id", auth_middleware_1.authMiddleware, policeRoles, (0, error_handler_1.errorHandler)(news_controller_1.default.deleteNews));
exports.default = router;
