"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.errorNotFound = exports.errorHandler = void 0;
const zod_1 = require("zod");
const bad_request_1 = require("../exceptions/bad-request");
const internal_exception_1 = require("../exceptions/internal-exception");
const root_1 = require("../exceptions/root");
const errorHandler = (method) => {
    return async (req, res, next) => {
        try {
            await method(req, res, next);
        }
        catch (error) {
            let exception;
            if (error instanceof root_1.HttpException) {
                exception = error;
            }
            else if (error instanceof zod_1.ZodError) {
                exception = new bad_request_1.BadRequestException(root_1.ErrorMessages.UN_PROCESSABLE_ENTITY, root_1.ErrorCode.UN_PROCESSABLE_ENTITY, error.issues);
            }
            else {
                console.log("error", error);
                exception = new internal_exception_1.InternalException(root_1.ErrorMessages.SOMETHING_WENT_WRONG, error, root_1.ErrorCode.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    };
};
exports.errorHandler = errorHandler;
// 404 Not Found Middleware
const errorNotFound = (req, res, next) => {
    res.status(404).json({
        status: false,
        message: "Route not found",
        errorCode: "POS-404",
        path: req.originalUrl,
    });
};
exports.errorNotFound = errorNotFound;
// Global Error Handler Middleware (must have 4 parameters)
const globalErrorHandler = (error, req, res, next) => {
    if (error instanceof root_1.HttpException) {
        res.status(error.statusCode).json({
            status: false,
            message: error.message,
            errorCode: `POS-${error.errorCode}`,
            errors: error.errors,
        });
    }
    else {
        console.error("Unhandled error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            errorCode: "POS-500",
            errors: null,
        });
    }
};
exports.globalErrorHandler = globalErrorHandler;
