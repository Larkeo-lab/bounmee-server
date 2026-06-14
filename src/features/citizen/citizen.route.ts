import { errorHandler } from "@src/shared/middleware/error-handler";
import { Router } from "express";
import citizenController from "./citizen.controller";

const router: Router = Router();

// === Citizen CRUD Routes ===

router.get("/", errorHandler(citizenController.getAllCitizens));

router.get("/:id", errorHandler(citizenController.getCitizenById));

router.put("/:id", errorHandler(citizenController.updateCitizen));


export default router;
