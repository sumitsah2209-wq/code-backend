"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.getCart = exports.remove = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
//! add to cart
const addToCart = async (req, res, next) => {
    try {
        // user
        const userId = req.user?.id;
        // product , qty
        const { productId, quantity } = req.body;
        let cart = null;
        cart = await cart_model_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new cart_model_1.default({
                user: userId,
                items: [{ product: productId, quantity: Number(quantity) }],
            });
        }
        else {
            if (cart.items.length > 0) {
                const isAlreadyExists = cart.items?.filter((item) => item?.product.toString() === productId.toString())[0];
                //adding new product
                if (!isAlreadyExists) {
                    cart.items.push({ product: productId, quantity: Number(quantity) });
                }
                else {
                    // updating already existing product qty
                    isAlreadyExists.quantity = Number(quantity);
                }
            }
            else {
                cart.items.push({ product: productId, quantity: Number(quantity) });
            }
        }
        await cart.save();
        res.status(201).json({
            message: "Product added to cart",
            data: cart,
            code: "SUCCESS",
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
//! remove from cart
const remove = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;
        const cart = await cart_model_1.default.findOne({ user: userId });
        if (!cart) {
            throw new error_handler_middleware_1.default("Cart not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        const new_items = cart.items.filter((item) => item.product.toString() !== productId.toString());
        cart.items = new_items;
        await cart.save();
        res.status(200).json({
            message: `product ${productId} removed from cart`,
            data: cart,
            code: "SUCCESS",
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
//! get cart
const getCart = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const cart = await cart_model_1.default.findOne({ user: userId })
            .populate({
            path: "user",
            select: "_id first_name last_name email role profile_image",
        })
            .populate({
            path: "items.product",
            populate: [
                { path: "category", select: "_id name  image" },
                { path: "brand", select: "_id logo name" },
            ],
        }); // 10 carts
        res.status(200).json({
            message: "cart fetched",
            data: cart,
            code: "SUCCESS",
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
//! clear cart
const clear = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const cart = await cart_model_1.default.findOne({ user: userId });
        if (!cart) {
            throw new error_handler_middleware_1.default("Cart not created yet", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        // delete
        // await cart.deleteOne()
        // empty items
        cart.items = [];
        await cart.save();
        res.status(200).json({
            message: "cart cleared",
            data: null,
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.clear = clear;
