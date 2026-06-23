import { errorHandler } from "@src/shared/middleware/error-handler";
import { authMiddleware } from "@src/shared/middleware/auth-middleware";
import { requireUserType } from "@src/shared/middleware/authorize";
import { Router } from "express";
import villageChiefController from "./village-chief.controller";

const router: Router = Router();

// Only a District Police may create/modify village chiefs
const onlyDistrict = requireUserType(["DISTRICT_POLICE"]);

// === Village Chief CRUD Routes (all require auth) ===
router.post(
  "/",
  authMiddleware,
  onlyDistrict,
  errorHandler(villageChiefController.createVillageChief),
);

router.get(
  "/",
  authMiddleware,
  errorHandler(villageChiefController.getAllVillageChiefs),
);

router.get(
  "/:id",
  authMiddleware,
  errorHandler(villageChiefController.getVillageChiefById),
);

// Self-profile: a VILLAGE_CHIEF updates their own record
router.put(
  "/me",
  authMiddleware,
  requireUserType(["VILLAGE_CHIEF"]),
  errorHandler(villageChiefController.updateMyVillageChief),
);

router.put(
  "/:id",
  authMiddleware,
  onlyDistrict,
  errorHandler(villageChiefController.updateVillageChief),
);

router.delete(
  "/:id",
  authMiddleware,
  onlyDistrict,
  errorHandler(villageChiefController.deleteVillageChief),
);

export default router;
