"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExpiration = exports.generateOTP = void 0;
const env_1 = require("../../config/env");
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const calculateExpiration = () => {
    const now = new Date();
    const expirationMinutes = Number.parseInt(env_1.envData.OTP_EXPIRATION_MINUTES, 10);
    now.setMinutes(now.getMinutes() + expirationMinutes);
    return now;
};
exports.calculateExpiration = calculateExpiration;
