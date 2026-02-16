import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";
import Category from "../models/category.model";
import Brand from "../models/brand.model";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { SortOrder } from "mongoose";
import { paginationMetadata } from "../utils/pagination.utils";

interface IExpressFiles {
  cover_image?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

// https://domain.com/products?query=xyz&page=1&perPage=10
const dir = "/products";

//! get all
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // filter & pagination
    const {
      query,
      page = "1",
      limit = "10",
      category,
      brand,
      minPrice,
      maxPrice,
      sortField = "createdAt:desc",
    } = req.query;
    const filter: Record<string, any> = {};
    const pageNum = parseInt(page as string);
    const pageLimit = parseInt(limit as string);
    const skip = (pageNum - 1) * pageLimit;

    //TODO: name , category , brand ,price range , pagination

    if (query && String(query).trim() !== "") {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    //* category
    if (category) {
      filter.category = category;
    }

    //* brand
    if (brand) {
      filter.brand = brand;
    }

    //* price range
    if (maxPrice || minPrice) {
      if (maxPrice) {
        filter.price.$lte = parseInt(maxPrice as string, 10);
      }

      if (minPrice) {
        filter.price.$gte = parseInt(minPrice as string, 10);
      }
    }

    // sort obj
    const [field, order] = String(sortField).split(":"); // [createdAt,desc]

    const sortObj: Record<string, SortOrder> = {
      [field]: order === "asc" ? 1 : -1,
    };

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .populate("brand")
        .limit(pageLimit)
        .skip(skip)
        .sort(sortObj),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Products fetched",
      data: products,
      pagination: paginationMetadata(pageNum, pageLimit, totalCount),
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

//!  get by id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id })
      .populate({ path: "category", select: "name image _id " })
      .populate("brand");

    if (!product) {
      throw new AppError("Product not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    res.status(200).json({
      message: `Product ${product._id} fetched`,
      data: product,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

//! create

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      stock,
      is_featured,
      new_arrival,
    } = req.body;

    // images
    const { cover_image, images } = req.files as IExpressFiles;

    if (!cover_image) {
      throw new AppError(
        "cover_image is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    if (!category) {
      throw new AppError(
        "Category is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    if (!brand) {
      throw new AppError("Brand is required", ERROR_CODES.VALIDATION_ERR, 400);
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      is_featured,
      new_arrival,
    });

    //
    const product_category = await Category.findOne({ _id: category });
    if (!product_category) {
      throw new AppError("Category not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    const product_brand = await Brand.findOne({ _id: brand });
    if (!product_brand) {
      throw new AppError("Brand not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    product.category = product_category._id;
    product.brand = product_brand._id;

    //! cover
    // upload
    const { path, public_id } = await upload(cover_image[0], dir);

    product.cover_image = {
      path: path,
      public_id: public_id,
    };

    //! images
    if (images && images.length > 0) {
      const promises = images.map(async (img) => await upload(img, dir));
      const uploadedImages = await Promise.all(promises);
      product.images = uploadedImages as any;
    }

    //! save product
    await product.save();

    res.status(201).json({
      message: `Product ${product._id} created`,
      data: product,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

// update

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // id
    const { id } = req.params;
    // data
    const {
      name,
      description,
      category,
      brand,
      price,
      stock,
      is_featured,
      new_arrival,
    } = req.body;

    // images
    const { cover_image, images } = req.files as IExpressFiles;

    const product = await Product.findOne({ _id: id });

    if (!product) {
      throw new AppError("Product not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (is_featured) product.is_featured = is_featured;
    if (new_arrival) product.new_arrival = new_arrival;

    if (category && category.toString() !== product.category.toString()) {
      const newCategory = await Category.findOne({ _id: category });
      if (!newCategory) {
        throw new AppError(
          "Category not found",
          ERROR_CODES.NOT_FOUND_ERR,
          404,
        );
      }

      product.category = newCategory._id;
    }

    if (brand && brand.toString() !== product.brand.toString()) {
      const newBrand = await Brand.findOne({ _id: brand });
      if (!newBrand) {
        throw new AppError("Brand not found", ERROR_CODES.NOT_FOUND_ERR, 404);
      }

      product.brand = newBrand._id;
    }

    if (cover_image && cover_image[0]) {
      const { path, public_id } = await upload(cover_image[0], dir);
      await deleteFile(product.cover_image.public_id);
      product.cover_image = {
        path: path,
        public_id: public_id,
      };
    }

    //! images
    // TODO: update images

    res.status(200).json({
      message: `Product ${id} updated`,
      data: product,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

// delete

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params; // product id

    const product = await Product.findOne({ _id: id });
    const imagesToDelete: string[] = [];

    if (!product) {
      throw new AppError("Product not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    imagesToDelete.push(product.cover_image.public_id);

    if (product.images && product.images.length > 0) {
      product.images.forEach((img: any) => {
        if (img?.public_id) {
          imagesToDelete.push(img?.public_id);
        }
      });
    }

    const promises = imagesToDelete.map(async (id) => await deleteFile(id));
    await Promise.all(promises);

    // await Promise.all(imagesToDelete.map(async (id) => await deleteFile(id)));

    await product.deleteOne();

    res.status(200).json({
      message: `Product ${id} deleted`,
      status: "success",
      code: "SUCCESS",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// get all featured

export const getAllFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({ is_featured: true });
    res.status(200).json({
      message: "featured products fetched",
      data: products,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};

// get all new arrivals
export const getAllNewArrivals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({ new_arrival: true });
    res.status(200).json({
      message: "new arrival products fetched",
      data: products,
      status: "success",
      code: "SUCCESS",
    });
  } catch (error) {
    next(error);
  }
};
