"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = require("./store.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const storeRouter = (0, express_1.Router)();
// // Secure all routes
storeRouter.use(auth_middleware_1.authMiddleware);
// Get all stores
storeRouter.get("/", (0, error_handler_1.errorHandler)(store_controller_1.storeController.getStores));
// Get store by ID
storeRouter.get("/:id", (0, error_handler_1.errorHandler)(store_controller_1.storeController.getStoreById));
// Update store
storeRouter.put("/:id", (0, error_handler_1.errorHandler)(store_controller_1.storeController.updateStore));
// Delete store
storeRouter.delete("/:id", (0, error_handler_1.errorHandler)(store_controller_1.storeController.deleteStore));
exports.default = storeRouter;
