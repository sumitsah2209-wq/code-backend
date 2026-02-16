import { NextFunction, Request, Response } from "express";
import Brand from "../models/brand.model";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { paginationMetadata } from "../utils/pagination.utils";

const dir = "/brands";

//* get all
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query, page = "1", limit = "10" } = req.query;
    const filter: Record<string, any> = {};

    // page
    // 100
    // page =1 , limit = 10
    //  id = 1 -10  => skip = 0
    // page =2 , limit = 10
    // 10
    // 10 id -11 , id 20  => skip 10
    // page 3 limit =10
    //  id = 21 - 30  => skip = 20

    const pageNum = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * pageLimit; // p = 3, skip = 20

    if (query && String(query).trim() !== "") {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }
    // const brands = await Brand.find(filter).limit(pageLimit).skip(skip).sort({'createdAt': -1});
    // const totalCount = await Brand.countDocuments(filter);

    const [brands, totalCount] = await Promise.all([
      Brand.find(filter).limit(pageLimit).skip(skip).sort({ createdAt: -1 }),
      Brand.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "Brands fetched",
      data: brands,
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

    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
      throw new AppError("Brand not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    res.status(200).json({
      message: `Brand ${brand._id} fetched`,
      data: brand,
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
    // auth logic

    const { name, description } = req.body;
    const file = req.file;
    if (!name) {
      throw new AppError(
        "Brand name is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    if (!file) {
      throw new AppError(
        "Brand logo is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    const brand = new Brand({ name, description });

    // file upload
    if (file) {
      const { path, public_id } = await upload(file, dir);

      brand.logo = {
        path: path,
        public_id: public_id,
      };
    }

    await brand.save();

    res.status(200).json({
      message: `Brand ${brand._id} created`,
      data: brand,
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
    // auth logic

    // id
    const { id } = req.params;
    // data
    const { name, description } = req.body;
    // file
    const file = req.file;

    // find brand
    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
      throw new AppError("Brand not found", ERROR_CODES.NOT_FOUND_ERR, 400);
    }

    if (name) {
      brand.name = name;
    }

    if (description) brand.description = description;

    if (file) {
      await deleteFile(brand.logo.public_id);
      const { path, public_id } = await upload(file);
      brand.logo = {
        path: path,
        public_id: public_id,
      };
    }

    // save brand
    await brand.save();

    res.status(200).json({
      message: `Brand ${brand._id} updated`,
      data: brand,
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
  // auth logic

  try {
    const { id } = req.params;

    const brand = await Brand.findOne({ _id: id });
    if (!brand) {
      throw new AppError("Brand not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    await deleteFile(brand.logo.public_id);

    await brand.deleteOne();

    res.status(200).json({
      message: `Brand ${brand._id} deleted`,
      code: "SUCCESS",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
