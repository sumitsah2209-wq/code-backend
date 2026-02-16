"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// user , product
const mongoose_1 = __importDefault(require("mongoose"));
const wishlist_schema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "User  is required"],
        ref: "user",
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "Product is required"],
    },
}, { timestamps: true });
// model
const Wishlist = mongoose_1.default.model("wishlist", wishlist_schema);
exports.default = Wishlist;
