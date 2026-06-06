"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const productRouter = (0, express_1.Router)();
// Secure all routes
productRouter.use(auth_middleware_1.authMiddleware);
// --- Product Routes ---
// Get all products (optional filter by storeId/categoryId via query)
productRouter.get("/", (0, error_handler_1.errorHandler)(product_controller_1.productController.getProducts));
// Create product
productRouter.post("/", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(product_controller_1.productController.createProduct));
// Get product by barcode
productRouter.get("/barcode/:barcode", (0, error_handler_1.errorHandler)(product_controller_1.productController.getProductByBarcode));
// Get product by ID
productRouter.get("/:id", (0, error_handler_1.errorHandler)(product_controller_1.productController.getProductById));
// Update product
productRouter.put("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(product_controller_1.productController.updateProduct));
// Delete product
productRouter.delete("/:id", auth_middleware_1.checkStore, (0, error_handler_1.errorHandler)(product_controller_1.productController.deleteProduct));
exports.default = productRouter;
