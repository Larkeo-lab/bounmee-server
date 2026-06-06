import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
// @ts-ignore
import sharp from "sharp";
import { envData } from "@src/config/env";

const s3Client = envData.STORAGE_TYPE === "S3" ? new S3Client({
  region: envData.S3_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: envData.S3_ACCESS_KEY || "",
    secretAccessKey: envData.S3_SECRET_KEY || "",
  },
  endpoint: envData.S3_ENDPOINT || undefined,
  forcePathStyle: !!envData.S3_ENDPOINT,
}) : null;

export const storageService = {
  async saveImage(tempPath: string, fileName: string) {
    const originalBuffer = fs.readFileSync(tempPath);
    
    // Prepare resized versions
    let mediumBuffer: Buffer;
    let smallBuffer: Buffer;

    try {
      mediumBuffer = await sharp(originalBuffer).resize(800).toBuffer();
      smallBuffer = await sharp(originalBuffer).resize(300).toBuffer();
    } catch (error) {
      console.error("Sharp failed, using original for all sizes:", error);
      mediumBuffer = originalBuffer;
      smallBuffer = originalBuffer;
    }

    if (envData.STORAGE_TYPE === "S3" && s3Client) {
      const uploadToS3 = async (buffer: Buffer, size: string) => {
        const key = `${size}/${fileName}`;
        await s3Client.send(new PutObjectCommand({
          Bucket: envData.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: "image/jpeg", // or detect from extension
        }));
        return `${envData.S3_PUBLIC_URL}/${key}`;
      };

      const [originalUrl, mediumUrl, smallUrl] = await Promise.all([
        uploadToS3(originalBuffer, "original"),
        uploadToS3(mediumBuffer, "medium"),
        uploadToS3(smallBuffer, "small"),
      ]);

      // Cleanup temp file
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

      return { originalUrl, mediumUrl, smallUrl, fileName };
    } else {
      // Local storage
      const uploadPath = path.join(process.cwd(), "src/shared/uploads");
      
      const sizes = ["original", "medium", "small"];
      sizes.forEach(size => {
        const dir = path.join(uploadPath, size);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      });

      fs.writeFileSync(path.join(uploadPath, "original", fileName), originalBuffer);
      fs.writeFileSync(path.join(uploadPath, "medium", fileName), mediumBuffer);
      fs.writeFileSync(path.join(uploadPath, "small", fileName), smallBuffer);

      // Cleanup temp file
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

      return { fileName };
    }
  },

  async deleteImage(fileName: string) {
    const sizes = ["original", "medium", "small"];

    if (envData.STORAGE_TYPE === "S3" && s3Client) {
      await Promise.all(sizes.map(size => 
        s3Client.send(new DeleteObjectCommand({
          Bucket: envData.S3_BUCKET_NAME,
          Key: `${size}/${fileName}`,
        }))
      ));
    } else {
      const uploadPath = path.join(process.cwd(), "src/shared/uploads");
      sizes.forEach(size => {
        const filePath = path.join(uploadPath, size, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
};
