import { authMiddleware } from "@src/shared/middleware/auth-middleware";
import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import reportController from "./report.controller";

const router: Router = Router();

// === Report CRUD Routes ===
router.post("/", authMiddleware, errorHandler(reportController.createReport));
router.get("/", authMiddleware, errorHandler(reportController.getAllReports));
router.get(
  "/village/:villageId",
  authMiddleware,
  errorHandler(reportController.getVillageReports),
);
router.get("/:id", authMiddleware, errorHandler(reportController.getReportById));
router.put("/:id", authMiddleware, errorHandler(reportController.updateReport));
router.put("/:id/forward", authMiddleware, errorHandler(reportController.forwardReport));
router.put("/:id/receive", authMiddleware, errorHandler(reportController.receiveReport));
router.put("/:id/resolve", authMiddleware, errorHandler(reportController.resolveReport));
router.delete("/:id", authMiddleware, errorHandler(reportController.deleteReport));

export default router;
