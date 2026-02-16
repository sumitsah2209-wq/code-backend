"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_config_1 = require("../config/env.config");
const enum_types_1 = require("../types/enum.types");
class AppError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        Error.captureStackTrace(this);
    }
}
const errorHandler = (error, req, res, next) => {
    const message = error?.message || "Internal sever error";
    const stausCode = error?.statusCode || 500;
    const code = error?.code || enum_types_1.ERROR_CODES.INTERNAL_SERVER_ERR;
    const status = error?.status || "error";
    console.log("error handler");
    console.log(error);
    res.status(stausCode).json({
        message,
        code,
        status,
        data: null,
        originalError: env_config_1.ENV_CONFIG.node_env === 'development' ? error.stack : null
    });
};
exports.errorHandler = errorHandler;
exports.default = AppError;
