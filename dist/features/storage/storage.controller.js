"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const response_format_1 = require("@src/shared/utils/response-format");
const bad_request_1 = require("@src/shared/exceptions/bad-request");
const root_1 = require("@src/shared/exceptions/root");
const storage_service_1 = require("@src/shared/services/storage.service");
const env_1 = require("@src/config/env");
exports.storageController = {
    uploadImage: async (req, res) => {
        // @ts-ignore
        if (!req.file) {
            throw new bad_request_1.BadRequestException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND, "No image uploaded");
        }
        const { file_name } = req.body;
        // @ts-ignore
        const originalName = file_name || req.file.filename.split('.')[0];
        // @ts-ignore
        const extension = path_1.default.extname(req.file.originalname) || ".jpg";
        const fileName = `${originalName}-${Date.now()}${extension}`;
        // @ts-ignore
        const result = await storage_service_1.storageService.saveImage(req.file.path, fileName);
        const protocol = req.protocol;
        const host = req.get("host");
        const baseUrl = `${protocol}://${host}/api/v1/storage/view-image`;
        if (env_1.envData.STORAGE_TYPE === "S3") {
            (0, response_format_1.ResponseSuccess)(res, {
                imageName: result.fileName,
                originalUrl: result.originalUrl,
                mediumUrl: result.mediumUrl,
                smallUrl: result.smallUrl,
            });
        }
        else {
            (0, response_format_1.ResponseSuccess)(res, {
                imageName: fileName,
                originalUrl: `${baseUrl}/original/${fileName}`,
                mediumUrl: `${baseUrl}/medium/${fileName}`,
                smallUrl: `${baseUrl}/small/${fileName}`,
            });
        }
    },
    viewImage: (req, res) => {
        const { size, filename } = req.params;
        const filePath = path_1.default.join(process.cwd(), "src/shared/uploads", size, filename);
        if (fs_1.default.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
            res.status(404).send("Image not found");
        }
    },
    deleteImage: async (req, res) => {
        const { filename } = req.params;
        await storage_service_1.storageService.deleteImage(filename);
        (0, response_format_1.ResponseSuccess)(res, { message: "Image deleted successfully" });
    }
};
