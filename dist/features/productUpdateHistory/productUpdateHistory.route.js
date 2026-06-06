"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productUpdateHistory_controller_1 = require("./productUpdateHistory.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const productUpdateHistoryRouter = (0, express_1.Router)();
// Secure all routes
productUpdateHistoryRouter.use(auth_middleware_1.authMiddleware);
// Get all product update histories
productUpdateHistoryRouter.get("/", (0, error_handler_1.errorHandler)(productUpdateHistory_controller_1.productUpdateHistoryController.getProductUpdateHistories));
// Create product update history
productUpdateHistoryRouter.post("/", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(productUpdateHistory_controller_1.productUpdateHistoryController.createProductUpdateHistory));
// Get product update history by ID
productUpdateHistoryRouter.get("/:id", (0, error_handler_1.errorHandler)(productUpdateHistory_controller_1.productUpdateHistoryController.getProductUpdateHistoryById));
// Update product update history
productUpdateHistoryRouter.put("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(productUpdateHistory_controller_1.productUpdateHistoryController.updateProductUpdateHistory));
// Delete product update history
productUpdateHistoryRouter.delete("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(productUpdateHistory_controller_1.productUpdateHistoryController.deleteProductUpdateHistory));
exports.default = productUpdateHistoryRouter;
