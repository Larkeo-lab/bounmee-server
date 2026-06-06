"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const member_validate_1 = require("./member.validate");
const member_service_1 = require("./member.service");
exports.memberController = {
    createMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember,
};
async function createMember(req, res) {
    const data = member_validate_1.createMemberSchema.parse(req.body);
    const result = await (0, member_service_1.createMemberService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getMembers(req, res) {
    const { storeId, search } = member_validate_1.getMembersQuerySchema.parse(req.query);
    const result = await (0, member_service_1.getMembersService)(storeId, search);
    // Using ResponsePaginationSuccess for consistency
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, 10, result.length);
}
async function getMemberById(req, res) {
    const { id } = member_validate_1.memberParamsSchema.parse(req.params);
    const result = await (0, member_service_1.getMemberByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updateMember(req, res) {
    const { id } = member_validate_1.memberParamsSchema.parse(req.params);
    const data = member_validate_1.updateMemberSchema.parse(req.body);
    const result = await (0, member_service_1.updateMemberService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deleteMember(req, res) {
    const { id } = member_validate_1.memberParamsSchema.parse(req.params);
    const result = await (0, member_service_1.deleteMemberService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
