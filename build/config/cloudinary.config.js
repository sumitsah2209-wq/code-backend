"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_config_1 = require("./env.config");
cloudinary_1.v2.config({
    cloud_name: env_config_1.ENV_CONFIG.cloud_name,
    api_key: env_config_1.ENV_CONFIG.cloudinary_api_key,
    api_secret: env_config_1.ENV_CONFIG.cloudinary_api_secret,
});
exports.default = cloudinary_1.v2;
