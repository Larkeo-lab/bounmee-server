import { Router } from "express";
// @ts-ignore
import multer from "multer";
import { storageController } from "./storage.controller";
import { errorHandler } from "@src/shared/middleware/error-handler";
import { authMiddleware } from "@src/shared/middleware/auth-middleware";
import path from "path";
import fs from "fs";

const storageRouter = Router();

// Setup Multer for disk storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = path.join(process.cwd(), "src/shared/uploads/original");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname) || ".jpg";
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Image routes
storageRouter.post("/image/upload", upload.single("image"), errorHandler(storageController.uploadImage));
storageRouter.delete("/image/:filename", authMiddleware, errorHandler(storageController.deleteImage));

// Serving routes
storageRouter.get("/view-image/:size/:filename", errorHandler(storageController.viewImage));

export default storageRouter;
