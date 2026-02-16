import { NextFunction, Request, Response } from "express";
import Wishlist from "../models/wishlist.model";
import Product from "../models/product.model";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";

// authenticate => only user

//! get wishlist
export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // userid
    const userId = req.user?.id;

    // find({})
    const lists = await Wishlist.find({ user: userId })
      .populate("product")
      .populate("user");

    res.status(200).json({
      message: "Wishlist fetched",
      data: lists,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

//! add/remove product to wishlist
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let wishlist = null;
    // userId  =>
    const userId = req.user?.id;
    // productId: req.body
    const { productId } = req.body;

    // find list (productId,userId)

    wishlist = await Wishlist.findOne({
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
    } else {
      const product = await Product.findOne({ _id: productId });

      if (!product) {
        throw new AppError("Product not found", ERROR_CODES.NOT_FOUND_ERR, 404);
      }

      // if not exists
      wishlist = await Wishlist.create({ user: userId, product: productId });

      res.status(201).json({
        message: `product {product._id} added to wishlists`,
        status: "success",
        data: wishlist,
        code: "SUCCESS",
      });
    }

    // if exists remove
    // else add to list
  } catch (error) {
    next(error);
  }
};

//! clear wishlist
export const clear = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    await Wishlist.deleteMany({ user: userId });

    res.status(200).json({
      message: "Wishlist cleared",
      data: null,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};
