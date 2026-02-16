"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const brand_schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    logo: {
        type: {
            public_id: {
                type: String,
                required: [true, 'public id is required']
            },
            path: {
                type: String,
                required: [true, 'path is required']
            }
        },
        required: [true, 'brand logo is required']
    }
}, { timestamps: true });
// brand model
const Brand = mongoose_1.default.model('brand', brand_schema);
exports.default = Brand;
