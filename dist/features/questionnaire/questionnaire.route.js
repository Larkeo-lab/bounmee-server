"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionnaire_controller_1 = require("./questionnaire.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const questionnaireRouter = (0, express_1.Router)();
// Secure all routes
questionnaireRouter.use(auth_middleware_1.authMiddleware);
questionnaireRouter.post("/", (0, error_handler_1.errorHandler)(questionnaire_controller_1.createQuestionnaire));
questionnaireRouter.get("/", (0, error_handler_1.errorHandler)(questionnaire_controller_1.getQuestionnaires));
questionnaireRouter.post("/submit", (0, error_handler_1.errorHandler)(questionnaire_controller_1.submitResponse));
questionnaireRouter.post("/check-completion", auth_middleware_1.authMiddleware, (0, error_handler_1.errorHandler)(questionnaire_controller_1.checkCompletion));
questionnaireRouter.get("/:id", (0, error_handler_1.errorHandler)(questionnaire_controller_1.getQuestionnaireById));
questionnaireRouter.put("/:id", (0, error_handler_1.errorHandler)(questionnaire_controller_1.updateQuestionnaire));
questionnaireRouter.delete("/:id", (0, error_handler_1.errorHandler)(questionnaire_controller_1.deleteQuestionnaire));
// Responses
questionnaireRouter.get("/:id/responses", (0, error_handler_1.errorHandler)(questionnaire_controller_1.getResponses));
exports.default = questionnaireRouter;
