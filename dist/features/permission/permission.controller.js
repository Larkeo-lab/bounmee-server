"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const permission_validate_1 = require("./permission.validate");
const permission_service_1 = require("./permission.service");
exports.PermissionController = {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
};
async function createPermission(req, res) {
    const data = permission_validate_1.createPermissionSchema.parse(req.body);
    const result = await (0, permission_service_1.createPermissionService)(data, "admin");
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function getPermissions(req, res) {
    const { storeId, isActive, search } = permission_validate_1.getPermissionsQuerySchema.parse(req.query);
    const result = await (0, permission_service_1.getPermissionsService)(storeId, isActive, search);
    // Using ResponsePaginationSuccess for consistency, even if not fully paginated yet
    (0, response_format_1.ResponsePaginationSuccess)(res, result, 1, 10, result.length);
}
async function getPermissionById(req, res) {
    const { id } = permission_validate_1.permissionParamsSchema.parse(req.params);
    const result = await (0, permission_service_1.getPermissionByIdService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function updatePermission(req, res) {
    const { id } = permission_validate_1.permissionParamsSchema.parse(req.params);
    const data = permission_validate_1.updatePermissionSchema.parse(req.body);
    const result = await (0, permission_service_1.updatePermissionService)(id, data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function deletePermission(req, res) {
    const { id } = permission_validate_1.permissionParamsSchema.parse(req.params);
    const result = await (0, permission_service_1.deletePermissionService)(id);
    (0, response_format_1.ResponseSuccess)(res, result);
}
