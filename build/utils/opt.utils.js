"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resend_otp = exports.createOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_utils_1 = require("./bcrypt.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const nodemailer_utils_1 = __importDefault(require("./nodemailer.utils"));
const email_utils_1 = require("./email.utils");
const createOtp = (length = 6) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += crypto_1.default.randomInt(9);
    }
    return otp;
};
exports.createOtp = createOtp;
const resend_otp = async (user) => {
    try {
        // generate otp
        const otp = (0, exports.createOtp)();
        // hash otp
        const otp_hash = await (0, bcrypt_utils_1.hashText)(otp.toString());
        const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp_hash = otp_hash;
        user.otp_expiry = otp_expiry;
        (0, nodemailer_utils_1.default)({
            to: user.email,
            html: (0, email_utils_1.otpVerificationHtml)(user, otp),
            subject: "Account Verification",
        });
        await user.save();
    }
    catch (error) {
        throw new error_handler_middleware_1.default(error?.message || "Something went wrong", enum_types_1.ERROR_CODES.INTERNAL_SERVER_ERR, 500);
    }
};
exports.resend_otp = resend_otp;
