"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const express_1 = require("express");
const citizen_controller_1 = __importDefault(require("./citizen.controller"));
const router = (0, express_1.Router)();
// === Citizen CRUD Routes ===
router.get("/", (0, error_handler_1.errorHandler)(citizen_controller_1.default.getAllCitizens));
router.get("/:id", (0, error_handler_1.errorHandler)(citizen_controller_1.default.getCitizenById));
router.put("/:id", (0, error_handler_1.errorHandler)(citizen_controller_1.default.updateCitizen));
exports.default = router;
