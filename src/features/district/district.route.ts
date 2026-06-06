import { authMiddleware } from "@src/shared/middleware/auth-middleware";
import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import districtController from "./district.controller";

const router: Router = Router();

// === District CRUD Routes (Officer authentication required) ===
// router.post("/", errorHandler(districtController.createDistrict));

router.get("/", errorHandler(districtController.getAllDistricts));

router.get("/:id", errorHandler(districtController.getDistrictById));

router.put("/:id", errorHandler(districtController.updateDistrict));

router.delete("/:id", errorHandler(districtController.deleteDistrict));

export default router;
