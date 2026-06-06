"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const root_1 = require("./root");
class NotFoundException extends root_1.HttpException {
    constructor(message, errorCode, errors = null) {
        super(message, 404, errorCode, errors);
    }
}
exports.NotFoundException = NotFoundException;
