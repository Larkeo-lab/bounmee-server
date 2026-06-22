"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const authorize_1 = require("../../shared/middleware/authorize");
const express_1 = require("express");
const police_district_controller_1 = __importDefault(require("./police-district.controller"));
const router = (0, express_1.Router)();
// Only the Police Department (highest authority) may create/modify districts
const onlyDepartment = (0, authorize_1.requireUserType)(["POLICE_DEPARTMENT"]);
// === Police District CRUD Routes (all require auth) ===
router.post("/", auth_middleware_1.authMiddleware, onlyDepartment, (0, error_handler_1.errorHandler)(police_district_controller_1.default.createPoliceDistrict));
router.get("/", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(police_district_controller_1.default.getAllPoliceDistricts));
router.get("/reports/list", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(police_district_controller_1.default.policeDistrictAndReportList));
router.get("/:id", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(police_district_controller_1.default.getPoliceDistrictById));
router.put("/:id", auth_middleware_1.authMiddleware, onlyDepartment, (0, error_handler_1.errorHandler)(police_district_controller_1.default.updatePoliceDistrict));
router.delete("/:id", auth_middleware_1.authMiddleware, onlyDepartment, (0, error_handler_1.errorHandler)(police_district_controller_1.default.deletePoliceDistrict));
exports.default = router;
