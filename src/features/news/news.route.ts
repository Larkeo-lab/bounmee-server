import { errorHandler } from "@src/shared/middleware/error-handler";
import { authMiddleware } from "@src/shared/middleware/auth-middleware";
import { requireUserType } from "@src/shared/middleware/authorize";
import { Router } from "express";
import newsController from "./news.controller";

const router: Router = Router();

// Any police role may create/manage news
const policeRoles = requireUserType([
  "POLICE_DEPARTMENT",
  "DISTRICT_POLICE",
  "VILLAGE_CHIEF",
]);

// === News CRUD Routes (all require auth) ===
router.post("/", authMiddleware, policeRoles, errorHandler(newsController.createNews));
router.get("/", authMiddleware, errorHandler(newsController.getAllNews));
router.get("/:id", authMiddleware, errorHandler(newsController.getNewsById));
router.put("/:id", authMiddleware, policeRoles, errorHandler(newsController.updateNews));
router.delete("/:id", authMiddleware, policeRoles, errorHandler(newsController.deleteNews));

export default router;
