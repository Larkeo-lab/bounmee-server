"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const express_1 = require("express");
const province_controller_1 = __importDefault(require("./province.controller"));
const router = (0, express_1.Router)();
// === Province CRUD Routes (Officer authentication required) ===
router.post("/", (0, error_handler_1.errorHandler)(province_controller_1.default.createProvince));
router.get("/", (0, error_handler_1.errorHandler)(province_controller_1.default.getAllProvinces));
router.get("/:id", (0, error_handler_1.errorHandler)(province_controller_1.default.getProvinceById));
router.put("/:id", (0, error_handler_1.errorHandler)(province_controller_1.default.updateProvince));
router.delete("/:id", (0, error_handler_1.errorHandler)(province_controller_1.default.deleteProvince));
exports.default = router;
