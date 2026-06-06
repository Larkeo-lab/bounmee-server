"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("@src/shared/middleware/error-handler");
const express_1 = require("express");
const district_controller_1 = __importDefault(require("./district.controller"));
const router = (0, express_1.Router)();
// === District CRUD Routes (Officer authentication required) ===
// router.post("/", errorHandler(districtController.createDistrict));
router.get("/", (0, error_handler_1.errorHandler)(district_controller_1.default.getAllDistricts));
router.get("/:id", (0, error_handler_1.errorHandler)(district_controller_1.default.getDistrictById));
router.put("/:id", (0, error_handler_1.errorHandler)(district_controller_1.default.updateDistrict));
router.delete("/:id", (0, error_handler_1.errorHandler)(district_controller_1.default.deleteDistrict));
exports.default = router;
