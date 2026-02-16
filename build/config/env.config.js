"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_CONFIG = void 0;
exports.ENV_CONFIG = {
    port: process.env.PORT,
    db_uri: process.env.DB_URI,
    db_name: process.env.DB_NAME,
    node_env: process.env.NODE_ENV,
    //! cloudinary
    cloud_name: process.env.CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    //! email
    smtp_host: process.env.SMTP_HOST,
    smtp_service: process.env.SMTP_SERVICE,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    // ! jwt
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN,
    //! cookie
    cookie_expires_in: process.env.COOKIE_EXPIRES_IN,
};
