"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const dir = "/categories";
//* get all
const getAll = async (req, res, next) => {
    try {
        const { query, page = "1", limit = "10" } = req.query;
        const filter = {};
        const pageNum = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);
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
            category_model_1.default.find(filter).limit(pageLimit).skip(skip),
            category_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            message: "categories fetched",
            data: categories,
            pagination: (0, pagination_utils_1.paginationMetadata)(pageNum, pageLimit, totalCount),
            code: "SUCCESS",
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
//* get by id
const getById = async (req, res, next) => {
    try {
        // id
        const { id } = req.params;
        const category = await category_model_1.default.findOne({ _id: id });
        if (!category) {
            throw new error_handler_middleware_1.default("Category not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        res.status(200).json({
            message: `category ${category._id} fetched`,
            data: category,
            code: "SUCCESS",
            status: "success",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
//* create
const create = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const file = req.file;
        if (!name) {
            throw new error_handler_middleware_1.default("Category name is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!file) {
            throw new error_handler_middleware_1.default("Category logo is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        const category = new category_model_1.default({ name, description });
        // file upload
        if (file) {
            const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, dir);
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
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
//* update
const update = async (req, res, next) => {
    try {
        // id
        const { id } = req.params;
        // data
        const { name, description } = req.body;
        // file
        const file = req.file;
        // find Category
        const category = await category_model_1.default.findOne({ _id: id });
        if (!category) {
            throw new error_handler_middleware_1.default("Category not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 400);
        }
        if (name) {
            category.name = name;
        }
        if (description)
            category.description = description;
        if (file) {
            await (0, cloudinary_utils_1.deleteFile)(category.image.public_id);
            const { path, public_id } = await (0, cloudinary_utils_1.upload)(file);
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
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
//* delete
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.default.findOne({ _id: id });
        if (!category) {
            throw new error_handler_middleware_1.default("Category not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        await (0, cloudinary_utils_1.deleteFile)(category.image.public_id);
        await category.deleteOne();
        res.status(200).json({
            message: `category ${category._id} deleted`,
            code: "SUCCESS",
            status: "success",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
