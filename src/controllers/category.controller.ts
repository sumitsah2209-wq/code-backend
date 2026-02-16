import { NextFunction, Request, Response } from "express";
import Category from "../models/category.model";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { paginationMetadata } from "../utils/pagination.utils";

const dir = "/categories";

//* get all
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query, page = "1", limit = "10" } = req.query;
    const filter: Record<string, any> = {};
    const pageNum = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * pageLimit;

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

    const [categories, totalCount] = await Promise.all([
      Category.find(filter).limit(pageLimit).skip(skip),
      Category.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "categories fetched",
      data: categories,
      pagination: paginationMetadata(pageNum, pageLimit, totalCount),
      code: "SUCCESS",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//* get by id
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // id
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw new AppError("Category not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    res.status(200).json({
      message: `category ${category._id} fetched`,
      data: category,
      code: "SUCCESS",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//* create

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description } = req.body;
    const file = req.file;
    if (!name) {
      throw new AppError(
        "Category name is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    if (!file) {
      throw new AppError(
        "Category logo is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    const category = new Category({ name, description });

    // file upload
    if (file) {
      const { path, public_id } = await upload(file, dir);

      category.image = {
        path: path,
        public_id: public_id,
      };
    }

    await category.save();

    res.status(200).json({
      message: `Category ${category._id} created`,
      data: category,
      code: "SUCCESS",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//* update
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // id
    const { id } = req.params;
    // data
    const { name, description } = req.body;
    // file
    const file = req.file;

    // find Category
    const category = await Category.findOne({ _id: id });

    if (!category) {
      throw new AppError("Category not found", ERROR_CODES.NOT_FOUND_ERR, 400);
    }

    if (name) {
      category.name = name;
    }

    if (description) category.description = description;

    if (file) {
      await deleteFile(category.image.public_id);
      const { path, public_id } = await upload(file);
      category.image = {
        path: path,
        public_id: public_id,
      };
    }

    // save Category
    await category.save();

    res.status(200).json({
      message: `Category ${category._id} updated`,
      data: category,
      code: "SUCCESS",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//* delete
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });
    if (!category) {
      throw new AppError("Category not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    await deleteFile(category.image.public_id);

    await category.deleteOne();

    res.status(200).json({
      message: `category ${category._id} deleted`,
      code: "SUCCESS",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
