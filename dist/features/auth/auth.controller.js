"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const response_format_1 = require("../../shared/utils/response-format");
const auth_validate_1 = require("./auth.validate");
const auth_service_1 = require("./auth.service");
exports.authController = {
    registerCitizen,
    login,
    refreshToken,
    changePassword,
};
async function registerCitizen(req, res) {
    const data = auth_validate_1.registerSchema.parse(req.body);
    const result = await (0, auth_service_1.registerService)(data);
    (0, response_format_1.ResponseSuccess)(res, result, 201);
}
async function login(req, res) {
    const data = auth_validate_1.loginSchema.parse(req.body);
    const result = await (0, auth_service_1.loginService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function refreshToken(req, res) {
    const data = auth_validate_1.refreshTokenSchema.parse(req.body);
    const result = await (0, auth_service_1.refreshTokenService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
async function changePassword(req, res) {
    const data = auth_validate_1.updatePasswordSchema.parse(req.body);
    const result = await (0, auth_service_1.changePasswordService)(data);
    (0, response_format_1.ResponseSuccess)(res, result);
}
