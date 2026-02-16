"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = exports.verifyOtp = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const opt_utils_1 = require("../utils/opt.utils");
const nodemailer_utils_1 = __importDefault(require("../utils/nodemailer.utils"));
const email_utils_1 = require("../utils/email.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = require("../config/env.config");
const dir = "/profile_images";
//! register
const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password, phone } = req.body;
        const file = req.file;
        if (!first_name) {
            throw new error_handler_middleware_1.default("first_name is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!last_name) {
            throw new error_handler_middleware_1.default("last_name is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!email) {
            throw new error_handler_middleware_1.default("email is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!password) {
            throw new error_handler_middleware_1.default("password is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        // create user
        // const user = await User.create({})
        const user = new user_model_1.default({ first_name, last_name, email, phone });
        // password hash
        const hash_password = await (0, bcrypt_utils_1.hashText)(password);
        user.password = hash_password;
        // profile image
        if (file) {
            //* upload image to cloudinary
            const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, dir);
            //* save image
            user.profile_image = {
                path: path,
                public_id: public_id,
            };
        }
        //! otp
        const otp = (0, opt_utils_1.createOtp)();
        const otp_hash = await (0, bcrypt_utils_1.hashText)(otp);
        const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp_hash = otp_hash;
        user.otp_expiry = otp_expiry;
        // send opt => email
        (0, nodemailer_utils_1.default)({
            to: user.email,
            subject: "Verify Account",
            html: (0, email_utils_1.otpVerificationHtml)(user, otp),
        });
        //! save user
        await user.save();
        //! success response
        res.status(201).json({
            message: "Account created",
            code: "SUCCESS",
            status: "success",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
//! login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw new error_handler_middleware_1.default("email is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!password) {
            throw new error_handler_middleware_1.default("password is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        // get user by email
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            throw new error_handler_middleware_1.default("email or password does not match.", enum_types_1.ERROR_CODES.AUTH_ERR, 400);
        }
        if (!user.is_verified) {
            throw new error_handler_middleware_1.default("Account is not verified.", enum_types_1.ERROR_CODES.AUTH_ERR, 400);
        }
        console.log(user);
        //? compare password
        const is_pass_match = await (0, bcrypt_utils_1.compareHash)(password, user.password);
        if (!is_pass_match) {
            throw new error_handler_middleware_1.default("email or password does not match.", enum_types_1.ERROR_CODES.AUTH_ERR, 400);
        }
        // generate jwt token
        const access_token = (0, jwt_utils_1.signAccessToken)({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        //! success response
        res
            .cookie("access_token", access_token, {
            httpOnly: env_config_1.ENV_CONFIG.node_env === "development" ? false : true,
            sameSite: env_config_1.ENV_CONFIG.node_env === "development" ? "lax" : "none",
            secure: env_config_1.ENV_CONFIG.node_env === "development" ? false : true,
            maxAge: Number(env_config_1.ENV_CONFIG.cookie_expires_in || "7") * 24 * 60 * 60 * 1000,
        })
            .status(201)
            .json({
            message: "Login successful!!",
            code: "SUCCESS",
            status: "success",
            data: user,
            access_token,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// verify-otp
const verifyOtp = async (req, res, next) => {
    try {
        // otp,email  <= req.body
        // find user by email
        // compare otp
        // opt => doesnot match  => error
        // check opt_expiry
        // if expired => error
        // update user
        // user.opt_hash = undefiend
        // user.otp_expiry = undefined
        // user.is_verified = true
        // await user.save()
        // success res
        const { email, otp } = req.body;
        if (!email) {
            throw new error_handler_middleware_1.default("Email is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!otp) {
            throw new error_handler_middleware_1.default("OTP is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        const user = await user_model_1.default.findOne({ email }).select("+otp_hash +otp_expiry");
        if (!user) {
            throw new error_handler_middleware_1.default("User not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        if (user.otp_expiry && user.otp_hash) {
            const is_otp_expired = new Date(Date.now()) > user.otp_expiry;
            if (is_otp_expired) {
                throw new error_handler_middleware_1.default("OTP is expired. Try resend otp", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
            }
            // compare otp
            const is_otp_matched = await (0, bcrypt_utils_1.compareHash)(otp.toString(), user.otp_hash);
            if (!is_otp_matched) {
                throw new error_handler_middleware_1.default("Invalid OTP. Try resend otp", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
            }
            user.is_verified = true;
            user.otp_hash = undefined;
            user.otp_expiry = undefined;
            await user.save();
            res.status(200).json({
                message: "Account verified",
                code: "SUCCESS",
                status: "success",
                data: null,
            });
        }
        else {
            throw new error_handler_middleware_1.default("Invalid Otp.Please try resend otp", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
//! resend otp
const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        //! find user
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            throw new error_handler_middleware_1.default("User not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        if (user.is_verified) {
            throw new error_handler_middleware_1.default("Account already verified.", enum_types_1.ERROR_CODES.AUTH_ERR, 400);
        }
        // resend otp
        await (0, opt_utils_1.resend_otp)(user);
        res.status(201).json({
            message: `Otp sent to email address ${user.email}.`,
            code: "SUCCESS",
            status: "success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resendOtp = resendOtp;
//* get user profile
