"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// @ts-ignore
const sharp_1 = __importDefault(require("sharp"));
const env_1 = require("@src/config/env");
const s3Client = env_1.envData.STORAGE_TYPE === "S3" ? new client_s3_1.S3Client({
    region: env_1.envData.S3_REGION || "ap-southeast-1",
    credentials: {
        accessKeyId: env_1.envData.S3_ACCESS_KEY || "",
        secretAccessKey: env_1.envData.S3_SECRET_KEY || "",
    },
    endpoint: env_1.envData.S3_ENDPOINT || undefined,
    forcePathStyle: !!env_1.envData.S3_ENDPOINT,
}) : null;
exports.storageService = {
    async saveImage(tempPath, fileName) {
        const originalBuffer = fs_1.default.readFileSync(tempPath);
        // Prepare resized versions
        let mediumBuffer;
        let smallBuffer;
        try {
            mediumBuffer = await (0, sharp_1.default)(originalBuffer).resize(800).toBuffer();
            smallBuffer = await (0, sharp_1.default)(originalBuffer).resize(300).toBuffer();
        }
        catch (error) {
            console.error("Sharp failed, using original for all sizes:", error);
            mediumBuffer = originalBuffer;
            smallBuffer = originalBuffer;
        }
        if (env_1.envData.STORAGE_TYPE === "S3" && s3Client) {
            const uploadToS3 = async (buffer, size) => {
                const key = `${size}/${fileName}`;
                await s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: env_1.envData.S3_BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: "image/jpeg", // or detect from extension
                }));
                return `${env_1.envData.S3_PUBLIC_URL}/${key}`;
            };
            const [originalUrl, mediumUrl, smallUrl] = await Promise.all([
                uploadToS3(originalBuffer, "original"),
                uploadToS3(mediumBuffer, "medium"),
                uploadToS3(smallBuffer, "small"),
            ]);
            // Cleanup temp file
            if (fs_1.default.existsSync(tempPath))
                fs_1.default.unlinkSync(tempPath);
            return { originalUrl, mediumUrl, smallUrl, fileName };
        }
        else {
            // Local storage
            const uploadPath = path_1.default.join(process.cwd(), "src/shared/uploads");
            const sizes = ["original", "medium", "small"];
            sizes.forEach(size => {
                const dir = path_1.default.join(uploadPath, size);
                if (!fs_1.default.existsSync(dir))
                    fs_1.default.mkdirSync(dir, { recursive: true });
            });
            fs_1.default.writeFileSync(path_1.default.join(uploadPath, "original", fileName), originalBuffer);
            fs_1.default.writeFileSync(path_1.default.join(uploadPath, "medium", fileName), mediumBuffer);
            fs_1.default.writeFileSync(path_1.default.join(uploadPath, "small", fileName), smallBuffer);
            // Cleanup temp file
            if (fs_1.default.existsSync(tempPath))
                fs_1.default.unlinkSync(tempPath);
            return { fileName };
        }
    },
    async deleteImage(fileName) {
        const sizes = ["original", "medium", "small"];
        if (env_1.envData.STORAGE_TYPE === "S3" && s3Client) {
            await Promise.all(sizes.map(size => s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: env_1.envData.S3_BUCKET_NAME,
                Key: `${size}/${fileName}`,
            }))));
        }
        else {
            const uploadPath = path_1.default.join(process.cwd(), "src/shared/uploads");
            sizes.forEach(size => {
                const filePath = path_1.default.join(uploadPath, size, fileName);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            });
        }
    }
};
