"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const error_handler_1 = require("../../shared/middleware/error-handler");
const auth_middleware_1 = require("../../shared/middleware/auth-middleware");
const contactRouter = (0, express_1.Router)();
// Secure all routes below
contactRouter.use(auth_middleware_1.authMiddleware);
// Create a contact
contactRouter.post("/", (0, error_handler_1.errorHandler)(contact_controller_1.contactController.createContact));
// Get all contacts
contactRouter.get("/", (0, error_handler_1.errorHandler)(contact_controller_1.contactController.getContacts));
// Get contact by ID
contactRouter.get("/:id", (0, error_handler_1.errorHandler)(contact_controller_1.contactController.getContactById));
// Update contact
contactRouter.put("/:id", (0, error_handler_1.errorHandler)(contact_controller_1.contactController.updateContact));
// Delete contact
contactRouter.delete("/:id", (0, error_handler_1.errorHandler)(contact_controller_1.contactController.deleteContact));
exports.default = contactRouter;
