"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("./env.config");
const tranporter = nodemailer_1.default.createTransport({
    host: env_config_1.ENV_CONFIG.smtp_host,
    service: env_config_1.ENV_CONFIG.smtp_service,
    port: Number(env_config_1.ENV_CONFIG.smtp_port) || 587,
    secure: Number(env_config_1.ENV_CONFIG.smtp_port) === 465 ? true : false,
    auth: {
        user: 'sunya.sagarbhandari@gmail.com',
        pass: "yvej fghp hkea wgfm"
    }
});
exports.default = tranporter;
