"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const categoryRouter = (0, express_1.Router)();
// Secure all routes
categoryRouter.use(auth_middleware_1.authMiddleware);
// Get all categories (optional filter by storeId via query)
categoryRouter.get("/", (0, error_handler_1.errorHandler)(category_controller_1.categoryController.getCategories));
// Create category
categoryRouter.post("/", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(category_controller_1.categoryController.createCategory));
// Get category by ID
categoryRouter.get("/:id", (0, error_handler_1.errorHandler)(category_controller_1.categoryController.getCategoryById));
// Update category
categoryRouter.put("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(category_controller_1.categoryController.updateCategory));
// Delete category
categoryRouter.delete("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(category_controller_1.categoryController.deleteCategory));
exports.default = categoryRouter;
