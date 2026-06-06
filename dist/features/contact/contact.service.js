"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactService = exports.updateContactService = exports.getContactByIdService = exports.getContactsService = exports.createContactService = void 0;
const prisma_1 = require("../../config/prisma");
const not_found_1 = require("../../shared/exceptions/not-found");
const root_1 = require("../../shared/exceptions/root");
const createContactService = async (data) => {
    const existing = await prisma_1.prisma.contact.findFirst();
    if (existing) {
        const result = await prisma_1.prisma.contact.update({
            where: { id: existing.id },
            data,
        });
        return result;
    }
    const result = await prisma_1.prisma.contact.create({
        data,
    });
    return result;
};
exports.createContactService = createContactService;
const getContactsService = async () => {
    const result = await prisma_1.prisma.contact.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};
exports.getContactsService = getContactsService;
const getContactByIdService = async (id) => {
    const result = await prisma_1.prisma.contact.findUnique({
        where: { id },
    });
    if (!result) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    return result;
};
exports.getContactByIdService = getContactByIdService;
const updateContactService = async (id, data) => {
    const existing = await prisma_1.prisma.contact.findUnique({ where: { id } });
    if (!existing) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    const result = await prisma_1.prisma.contact.update({
        where: { id },
        data,
    });
    return result;
};
exports.updateContactService = updateContactService;
const deleteContactService = async (id) => {
    const existing = await prisma_1.prisma.contact.findUnique({ where: { id } });
    if (!existing) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.RESOURCE_NOT_FOUND, root_1.ErrorCode.RESOURCE_NOT_FOUND);
    }
    await prisma_1.prisma.contact.delete({ where: { id } });
    return { id, message: "Contact deleted successfully" };
};
exports.deleteContactService = deleteContactService;
