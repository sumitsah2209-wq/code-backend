"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.create = exports.getWishlist = void 0;
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
// authenticate => only user
//! get wishlist
const getWishlist = async (req, res, next) => {
    try {
        // userid
        const userId = req.user?.id;
        // find({})
        const lists = await wishlist_model_1.default.find({ user: userId })
            .populate("product")
            .populate("user");
        res.status(200).json({
            message: "Wishlist fetched",
            data: lists,
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getWishlist = getWishlist;
//! add/remove product to wishlist
const create = async (req, res, next) => {
    try {
        let wishlist = null;
        // userId  =>
        const userId = req.user?.id;
        // productId: req.body
        const { productId } = req.body;
        // find list (productId,userId)
        wishlist = await wishlist_model_1.default.findOne({
            user: userId,
            product: productId,
        });
        if (wishlist) {
            // if exists
            await wishlist.deleteOne();
            res.status(200).json({
                message: `product ${productId} removed`,
                data: null,
                status: "success",
                code: "SUCCESS",
            });
        }
        else {
            const product = await product_model_1.default.findOne({ _id: productId });
            if (!product) {
                throw new error_handler_middleware_1.default("Product not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
            }
            // if not exists
            wishlist = await wishlist_model_1.default.create({ user: userId, product: productId });
            res.status(201).json({
                message: `product {product._id} added to wishlists`,
                status: "success",
                data: wishlist,
                code: "SUCCESS",
            });
        }
        // if exists remove
        // else add to list
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
//! clear wishlist
const clear = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        await wishlist_model_1.default.deleteMany({ user: userId });
        res.status(200).json({
            message: "Wishlist cleared",
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
