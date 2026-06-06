"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const contact_validate_1 = require("./contact.validate");
const contact_service_1 = require("./contact.service");
exports.contactController = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
};
async function createContact(req, res) {
    const data = contact_validate_1.createContactSchema.parse(req.body);
    const result = await (0, contact_service_1.createContactService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getContacts(req, res) {
    const result = await (0, contact_service_1.getContactsService)();
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, result.length, result.length);
}
async function getContactById(req, res) {
    const { id } = contact_validate_1.contactParamsSchema.parse(req.params);
    const result = await (0, contact_service_1.getContactByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateContact(req, res) {
    const { id } = contact_validate_1.contactParamsSchema.parse(req.params);
    const data = contact_validate_1.updateContactSchema.parse(req.body);
    const result = await (0, contact_service_1.updateContactService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteContact(req, res) {
    const { id } = contact_validate_1.contactParamsSchema.parse(req.params);
    const result = await (0, contact_service_1.deleteContactService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
