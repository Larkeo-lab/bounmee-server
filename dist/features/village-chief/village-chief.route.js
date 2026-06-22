"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const authorize_1 = require("../../shared/middleware/authorize");
const express_1 = require("express");
const village_chief_controller_1 = __importDefault(require("./village-chief.controller"));
const router = (0, express_1.Router)();
// Only a District Police may create/modify village chiefs
const onlyDistrict = (0, authorize_1.requireUserType)(["DISTRICT_POLICE"]);
// === Village Chief CRUD Routes (all require auth) ===
router.post("/", auth_middleware_1.authMiddleware, onlyDistrict, (0, error_handler_1.errorHandler)(village_chief_controller_1.default.createVillageChief));
router.get("/", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(village_chief_controller_1.default.getAllVillageChiefs));
router.get("/:id", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(village_chief_controller_1.default.getVillageChiefById));
router.put("/:id", auth_middleware_1.authMiddleware, onlyDistrict, (0, error_handler_1.errorHandler)(village_chief_controller_1.default.updateVillageChief));
router.delete("/:id", auth_middleware_1.authMiddleware, onlyDistrict, (0, error_handler_1.errorHandler)(village_chief_controller_1.default.deleteVillageChief));
exports.default = router;
