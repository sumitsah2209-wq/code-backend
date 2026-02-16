"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const category_schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
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
        required: [true, 'category image is required']
    }
}, { timestamps: true });
// category model
const Category = mongoose_1.default.model('category', category_schema);
exports.default = Category;
