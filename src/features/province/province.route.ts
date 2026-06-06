import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import provinceController from "./province.controller";

const router: Router = Router();

// === Province CRUD Routes (Officer authentication required) ===
router.post("/", errorHandler(provinceController.createProvince));

router.get("/", errorHandler(provinceController.getAllProvinces));

router.get("/:id", errorHandler(provinceController.getProvinceById));

router.put("/:id", errorHandler(provinceController.updateProvince));

router.delete("/:id", errorHandler(provinceController.deleteProvince));

export default router;
