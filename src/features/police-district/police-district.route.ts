import { errorHandler } from "@src/shared/middleware/error-handler";
import { authMiddleware } from "@src/shared/middleware/auth-middleware";
import { requireUserType } from "@src/shared/middleware/authorize";
import { Router } from "express";
import policeDistrictController from "./police-district.controller";

const router: Router = Router();

// Only the Police Department (highest authority) may create/modify districts
const onlyDepartment = requireUserType(["POLICE_DEPARTMENT"]);

// === Police District CRUD Routes (all require auth) ===
router.post(
  "/",
  authMiddleware,
  onlyDepartment,
  errorHandler(policeDistrictController.createPoliceDistrict),
);

router.get(
  "/",
  authMiddleware,
  errorHandler(policeDistrictController.getAllPoliceDistricts),
);

router.get(
  "/:id",
  authMiddleware,
  errorHandler(policeDistrictController.getPoliceDistrictById),
);

router.put(
  "/:id",
  authMiddleware,
  onlyDepartment,
  errorHandler(policeDistrictController.updatePoliceDistrict),
);

router.delete(
  "/:id",
  authMiddleware,
  onlyDepartment,
  errorHandler(policeDistrictController.deletePoliceDistrict),
);

export default router;
