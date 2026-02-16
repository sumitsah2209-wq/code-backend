"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enum_types_1 = require("../types/enum.types");
// user schema
const user_schema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: [true, "user first_name is required"],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, "user last_name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "user already exists with provided email"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "email is required"],
        minLength: [6, "password must be atleast 6 char. long"],
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(enum_types_1.ROLE),
        default: enum_types_1.ROLE.USER,
    },
    // is_verified:false
    is_verified: {
        type: Boolean,
        default: false,
    },
    otp_hash: {
        type: String,
        select: false,
    },
    otp_expiry: {
        type: Date,
        select: false,
    },
    phone: {
        type: String,
    },
    // image upload  => server  => cloud
    // cloudinary  => aws, azure
    // profile_image:{path:url , public_id:id}
    profile_image: {
        type: {
            path: {
                type: String,
                required: [true, "profile_mage url is requred"],
            },
            public_id: {
                type: String,
                required: [true, "public_id is required"],
            },
        },
        required: false,
    },
}, { timestamps: true });
//! user model
const User = mongoose_1.default.model("user", user_schema);
exports.default = User;
