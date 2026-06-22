"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const express_1 = require("express");
const village_controller_1 = __importDefault(require("./village.controller"));
const router = (0, express_1.Router)();
// === Village CRUD Routes ===
router.get("/", (0, error_handler_1.errorHandler)(village_controller_1.default.getAllVillages));
router.get("/:id", (0, error_handler_1.errorHandler)(village_controller_1.default.getVillageById));
router.put("/:id", (0, error_handler_1.errorHandler)(village_controller_1.default.updateVillage));
router.delete("/:id", (0, error_handler_1.errorHandler)(village_controller_1.default.deleteVillage));
exports.default = router;
