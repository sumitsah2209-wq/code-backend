import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";

//! add to cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // user
    const userId = req.user?.id;
    // product , qty
    const { productId, quantity } = req.body;
    let cart = null;

    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity: Number(quantity) }],
      });
    } else {
      if (cart.items.length > 0) {
        const isAlreadyExists: any = cart.items?.filter(
          (item: any) => item?.product.toString() === productId.toString(),
        )[0];
        //adding new product
        if (!isAlreadyExists) {
          cart.items.push({ product: productId, quantity: Number(quantity) });
        } else {
          // updating already existing product qty
          isAlreadyExists.quantity = Number(quantity);
        }
      } else {
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
  } catch (error) {
    next(error);
  }
};

//! remove from cart
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new AppError("Cart not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    const new_items = cart.items.filter(
      (item: any) => item.product.toString() !== productId.toString(),
    );

    cart.items = new_items as any;

    await cart.save();

    res.status(200).json({
      message: `product ${productId} removed from cart`,
      data: cart,
      code: "SUCCESS",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//! get cart
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const cart = await Cart.findOne({ user: userId })
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
  } catch (error) {
    next(error);
  }
};

//! clear cart
export const clear = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new AppError(
        "Cart not created yet",
        ERROR_CODES.NOT_FOUND_ERR,
        404,
      );
    }

    // delete
    // await cart.deleteOne()

    // empty items
    cart.items = [] as any;

    await cart.save();

    res.status(200).json({
      message: "cart cleared",
      data: null,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};
