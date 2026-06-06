import { Router } from "express";
import { PublicController } from "./public.controller";
import { errorHandler } from "@src/shared/middleware/error-handler";

const publicRouter = Router();

publicRouter.get("/table/:qrCode", errorHandler(PublicController.getTableByQr));
publicRouter.get("/products/:storeId", errorHandler(PublicController.getPublicProducts));
publicRouter.post("/order", errorHandler(PublicController.submitCustomerOrder));

export default publicRouter;
