import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { ResponseSuccess } from "@src/shared/utils/response-format";
import { BadRequestException } from "@src/shared/exceptions/bad-request";
import { ErrorCode, ErrorMessages } from "@src/shared/exceptions/root";
import { storageService } from "@src/shared/services/storage.service";
import { envData } from "@src/config/env";

export const storageController = {
  uploadImage: async (req: Request, res: Response) => {
    // @ts-ignore
    if (!req.file) {
      throw new BadRequestException(
        ErrorMessages.RESOURCE_NOT_FOUND,
        ErrorCode.RESOURCE_NOT_FOUND,
        "No image uploaded"
      );
    }

    const { file_name } = req.body;
    // @ts-ignore
    const originalName = file_name || req.file.filename.split('.')[0];
    // @ts-ignore
    const extension = path.extname(req.file.originalname) || ".jpg";
    const fileName = `${originalName}-${Date.now()}${extension}`;

    // @ts-ignore
    const result = await storageService.saveImage(req.file.path, fileName);

    const protocol = req.protocol;
    const host = req.get("host");
    const baseUrl = `${protocol}://${host}/api/v1/storage/view-image`;

    if (envData.STORAGE_TYPE === "S3") {
      ResponseSuccess(res, {
        imageName: result.fileName,
        originalUrl: result.originalUrl,
        mediumUrl: result.mediumUrl,
        smallUrl: result.smallUrl,
      });
    } else {
      ResponseSuccess(res, {
        imageName: fileName,
        originalUrl: `${baseUrl}/original/${fileName}`,
        mediumUrl: `${baseUrl}/medium/${fileName}`,
        smallUrl: `${baseUrl}/small/${fileName}`,
      });
    }
  },

  viewImage: (req: Request, res: Response) => {
    const { size, filename } = req.params;
    const filePath = path.join(process.cwd(), "src/shared/uploads", size, filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Image not found");
    }
  },

  deleteImage: async (req: Request, res: Response) => {
    const { filename } = req.params;
    await storageService.deleteImage(filename);
    ResponseSuccess(res, { message: "Image deleted successfully" });
  }
};
