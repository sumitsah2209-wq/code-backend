"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createOtp = (length = 6) => {
    console.log("createOtp called");
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += crypto_1.default.randomInt(10);
    }
    return otp;
};
exports.createOtp = createOtp;
