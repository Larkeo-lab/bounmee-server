"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const env_1 = require("@src/config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = {
    sign: (payload) => jsonwebtoken_1.default.sign(payload, env_1.envData.JWT_SECRET, {
        expiresIn: env_1.envData.JWT_EXPIRES_IN,
        algorithm: "HS256",
    }),
    signRefreshToken: (payload) => jsonwebtoken_1.default.sign(payload, env_1.envData.JWT_REFRESH_SECRET, {
        expiresIn: env_1.envData.JWT_REFRESH_EXPIRES_IN,
        algorithm: "HS256",
    }),
    verify: (token) => jsonwebtoken_1.default.verify(token, env_1.envData.JWT_SECRET),
    verifyRefreshToken: (token) => jsonwebtoken_1.default.verify(token, env_1.envData.JWT_REFRESH_SECRET),
};
// Password Hashing
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 12);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
