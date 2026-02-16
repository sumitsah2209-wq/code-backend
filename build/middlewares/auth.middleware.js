"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const error_handler_middleware_1 = __importDefault(require("./error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = require("../config/env.config");
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticate = (roles) => {
    // middleware
    return async (req, res, next) => {
        try {
            // cookies
            const cookies = req.cookies;
            // get token
            const token = cookies["access_token"];
            if (!token) {
                throw new error_handler_middleware_1.default("Unauthorized.Access denied", enum_types_1.ERROR_CODES.AUTH_ERR, 401);
            }
            // verify token
            const decodedData = (0, jwt_utils_1.verifyToken)(token);
            if (!decodedData) {
                throw new error_handler_middleware_1.default("Invalid token.", enum_types_1.ERROR_CODES.AUTH_ERR, 400);
            }
            // check expired
            if (decodedData.exp * 1000 < Date.now()) {
                // cookie
                res.clearCookie("access_token", {
                    httpOnly: env_config_1.ENV_CONFIG.node_env === "development" ? false : true,
                    sameSite: env_config_1.ENV_CONFIG.node_env === "development" ? "lax" : "none",
                    secure: env_config_1.ENV_CONFIG.node_env === "development" ? false : true,
                    maxAge: Date.now(),
                });
                throw new error_handler_middleware_1.default("Token expired.Login required", enum_types_1.ERROR_CODES.AUTH_ERR, 401);
            }
            // is user exists
            const user = await user_model_1.default.findOne({ email: decodedData.email });
            if (!user) {
                throw new error_handler_middleware_1.default("Unauthorized.Access denied", enum_types_1.ERROR_CODES.AUTH_ERR, 401);
            }
            // check role
            if (roles && Array.isArray(roles) && !roles.includes(user.role)) {
                throw new error_handler_middleware_1.default("Forbidden.Access denied", enum_types_1.ERROR_CODES.AUTH_ERR, 403);
            }
            req.user = {
                id: user._id,
                role: user.role,
                email: user.email,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticate = authenticate;
