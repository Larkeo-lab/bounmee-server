import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import policeDepartmentController from "./police-department.controller";

const router: Router = Router();

// === Police Department CRUD Routes ===
router.post(
  "/",
  errorHandler(policeDepartmentController.createPoliceDepartment),
);

router.get(
  "/",
  errorHandler(policeDepartmentController.getAllPoliceDepartments),
);

router.get(
  "/:id",
  errorHandler(policeDepartmentController.getPoliceDepartmentById),
);

router.put(
  "/:id",
  errorHandler(policeDepartmentController.updatePoliceDepartment),
);

router.delete(
  "/:id",
  errorHandler(policeDepartmentController.deletePoliceDepartment),
);

export default router;
