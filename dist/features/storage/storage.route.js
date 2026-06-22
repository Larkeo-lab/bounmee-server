"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// @ts-ignore
const multer_1 = __importDefault(require("multer"));
const storage_controller_1 = require("./storage.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storageRouter = (0, express_1.Router)();
// Setup Multer for disk storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), "src/shared/uploads/original");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname) || ".jpg";
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
// Image routes
storageRouter.post("/image/upload", upload.single("image"), (0, error_handler_1.errorHandler)(storage_controller_1.storageController.uploadImage));
storageRouter.delete("/image/:filename", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(storage_controller_1.storageController.deleteImage));
// Serving routes
storageRouter.get("/view-image/:size/:filename", (0, error_handler_1.errorHandler)(storage_controller_1.storageController.viewImage));
exports.default = storageRouter;
