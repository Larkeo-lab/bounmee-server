"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = exports.updateProfileService = exports.refreshTokenService = exports.loginService = exports.registerService = void 0;
const prisma_1 = require("@config/prisma");
const crypto_1 = require("crypto");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = __importDefault(require("@src/shared/utils/jwt"));
const not_found_1 = require("@exceptions/not-found");
const root_1 = require("@exceptions/root");
const bad_request_1 = require("@src/shared/exceptions/bad-request");
const registerService = async (data) => {
    const hashedPassword = (0, bcryptjs_1.hashSync)(data.password, 10);
    // Check if username, email, or phone is already registered
    const checkAlreadyExists = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                { userName: data.userName },
                data.email ? { email: data.email } : undefined,
                data.phone ? { phone: data.phone } : undefined,
            ].filter(Boolean),
        },
    });
    if (checkAlreadyExists) {
        let duplicatedField = "";
        if (checkAlreadyExists.userName === data.userName) {
            duplicatedField = "Username";
        }
        else if (data.email && checkAlreadyExists.email === data.email) {
            duplicatedField = "Email";
        }
        else if (data.phone && checkAlreadyExists.phone === data.phone) {
            duplicatedField = "Phone number";
        }
        throw new bad_request_1.BadRequestException(root_1.ErrorMessages.USER_ALREADY_EXISTS, root_1.ErrorCode.USER_ALREADY_EXISTS, { duplicatedField });
    }
    // Generate cartId as required by user.prisma
    const cartId = (0, crypto_1.randomUUID)();
    const user = await prisma_1.prisma.user.create({
        data: {
            userName: data.userName,
            password: hashedPassword,
            email: data.email || null,
            phone: data.phone || null,
            profileImage: data.profileImage || null,
            provinceId: data.provinceId || null,
            districtId: data.districtId || null,
            address: data.address || null,
            cartId: cartId,
            role: "CITIZEN", // Default role for registered users
        },
        include: {
            province: true,
            district: true,
        },
    });
    const accessToken = jwt_1.default.sign({
        userId: user.id,
        role: user.role,
    });
    const refreshToken = jwt_1.default.signRefreshToken({
        userId: user.id,
        role: user.role,
    });
    const { password, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
};
exports.registerService = registerService;
const loginService = async (data) => {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                { email: data.identifier },
                { userName: data.identifier },
                { phone: data.identifier },
            ],
        },
        include: {
            province: true,
            district: true,
        },
    });
    if (!user) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.USER_NOT_FOUND, root_1.ErrorCode.USER_NOT_FOUND);
    }
    if (!user.password) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.USER_NOT_FOUND, root_1.ErrorCode.USER_NOT_FOUND);
    }
    const isPasswordValid = (0, bcryptjs_1.compareSync)(data.password, user.password);
    if (!isPasswordValid) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.INCORRECT_PASSWORD, root_1.ErrorCode.INCORRECT_PASSWORD);
    }
    const accessToken = jwt_1.default.sign({
        userId: user.id,
        role: user.role,
    });
    const refreshToken = jwt_1.default.signRefreshToken({
        userId: user.id,
        role: user.role,
    });
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
};
exports.loginService = loginService;
const refreshTokenService = async (data) => {
    const { refreshToken } = data;
    const payload = jwt_1.default.verifyRefreshToken(refreshToken);
    const accessToken = jwt_1.default.sign({
        userId: payload.userId,
        role: payload.role,
    });
    const newRefreshToken = jwt_1.default.signRefreshToken({
        userId: payload.userId,
        role: payload.role,
    });
    return { accessToken, refreshToken: newRefreshToken };
};
exports.refreshTokenService = refreshTokenService;
const updateProfileService = async (userId, data) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.USER_NOT_FOUND, root_1.ErrorCode.USER_NOT_FOUND);
    }
    const result = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            email: data.email,
            phone: data.phone,
            profileImage: data.profileImage,
            provinceId: data.provinceId,
            districtId: data.districtId,
            address: data.address,
        },
        include: {
            province: true,
            district: true,
        },
    });
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};
exports.updateProfileService = updateProfileService;
const changePasswordService = async (data) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: data.userId },
    });
    if (!user) {
        throw new not_found_1.NotFoundException(root_1.ErrorMessages.USER_NOT_FOUND, root_1.ErrorCode.USER_NOT_FOUND);
    }
    const hashedPassword = (0, bcryptjs_1.hashSync)(data.password, 10);
    const result = await prisma_1.prisma.user.update({
        where: { id: data.userId },
        data: {
            password: hashedPassword,
        },
    });
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};
exports.changePasswordService = changePasswordService;
