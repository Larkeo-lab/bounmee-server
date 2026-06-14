import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import villageController from "./village.controller";

const router: Router = Router();

// === Village CRUD Routes ===
router.get("/", errorHandler(villageController.getAllVillages));
router.get("/:id", errorHandler(villageController.getVillageById));
router.put("/:id", errorHandler(villageController.updateVillage));
router.delete("/:id", errorHandler(villageController.deleteVillage));

export default router;
