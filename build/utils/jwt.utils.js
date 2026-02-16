"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
// '1h' '1m' , '1d'  '2 days'
// nummer 12, 345000
// sign 
const signAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_config_1.ENV_CONFIG.jwt_secret, {
        expiresIn: env_config_1.ENV_CONFIG.jwt_expires_in
    });
};
exports.signAccessToken = signAccessToken;
// verify
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_config_1.ENV_CONFIG.jwt_secret);
};
exports.verifyToken = verifyToken;
