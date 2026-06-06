"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseManyDataSuccess = exports.ResponsePaginationSuccess = exports.ResponseSuccess = void 0;
const ResponseSuccess = (res, data, statusCode = 200) => {
    const { message = "SUCCESS", code: responseCode, ...restData } = data;
    res.status(statusCode).json({
        code: responseCode || `POS-${statusCode}`,
        message,
        data: restData,
    });
};
exports.ResponseSuccess = ResponseSuccess;
const ResponsePaginationSuccess = (res, data, page, limit, total, statusCode = 200, extraData) => {
    const totalPages = Math.ceil(total / limit);
    res.status(statusCode).json({
        code: `POS-${statusCode}`,
        message: "SUCCESS",
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
        ...extraData,
    });
};
exports.ResponsePaginationSuccess = ResponsePaginationSuccess;
const ResponseManyDataSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        code: `POS-${statusCode}`,
        message: "SUCCESS",
        data,
    });
};
exports.ResponseManyDataSuccess = ResponseManyDataSuccess;
