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
  "/reports/list",
  authMiddleware,
  errorHandler(policeDistrictController.policeDistrictAndReportList),
);

// POLICE_DEPARTMENT (province level): every district in the dept's province + reports
router.get(
  "/reports/department/list",
  authMiddleware,
  onlyDepartment,
  errorHandler(policeDistrictController.policeDepartmentAndReportList),
);

// District detail (id = District id): villages + per-village report counts
router.get(
  "/:id/villages",
  authMiddleware,
  errorHandler(policeDistrictController.getPoliceDistrictByIdAndReport),
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
