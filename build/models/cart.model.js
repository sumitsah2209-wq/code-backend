"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"],
    },
    items: [
        {
            type: {
                product: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    required: [true, "product is required"],
                    ref: "product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        },
    ],
}, { timestamps: true });
const Cart = mongoose_1.default.model("cart", cartSchema);
exports.default = Cart;
