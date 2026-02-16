"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashText = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// hash function
const hashText = async (input) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(11);
        return await bcryptjs_1.default.hash(input, salt);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.hashText = hashText;
const compareHash = async (text, hash) => {
    try {
        return await bcryptjs_1.default.compare(text, hash);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.compareHash = compareHash;
