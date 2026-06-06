"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRoute = void 0;
const express_1 = require("express");
const table_controller_1 = require("./table.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const tableRoute = (0, express_1.Router)();
exports.tableRoute = tableRoute;
// Require authentication for all routes
tableRoute.use(auth_middleware_1.authMiddleware);
// Zone Routes
tableRoute.post("/zones", (0, error_handler_1.errorHandler)(table_controller_1.TableController.createZone));
tableRoute.get("/zones", (0, error_handler_1.errorHandler)(table_controller_1.TableController.getZones));
tableRoute.put("/zones/:id", (0, error_handler_1.errorHandler)(table_controller_1.TableController.updateZone));
tableRoute.delete("/zones/:id", (0, error_handler_1.errorHandler)(table_controller_1.TableController.deleteZone));
// Table Routes
tableRoute.post("/generate-qrcodes", (0, error_handler_1.errorHandler)(table_controller_1.TableController.generateMissingQrCodes));
tableRoute.post("/", (0, error_handler_1.errorHandler)(table_controller_1.TableController.createTable));
tableRoute.get("/", (0, error_handler_1.errorHandler)(table_controller_1.TableController.getTables));
tableRoute.get("/:id", (0, error_handler_1.errorHandler)(table_controller_1.TableController.getTableById));
tableRoute.put("/:id", (0, error_handler_1.errorHandler)(table_controller_1.TableController.updateTable));
tableRoute.delete("/:id", (0, error_handler_1.errorHandler)(table_controller_1.TableController.deleteTable));
