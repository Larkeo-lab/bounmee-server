"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = void 0;
const root_1 = require("./root");
class UnauthorizedException extends root_1.HttpException {
    constructor(message, errorCode) {
        super(message, 401, errorCode, null);
    }
}
exports.UnauthorizedException = UnauthorizedException;
