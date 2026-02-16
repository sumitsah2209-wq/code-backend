"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const dir = "/brands";
//* get all
const getAll = async (req, res, next) => {
    try {
        const { query, page = "1", limit = "10" } = req.query;
        const filter = {};
        // page
        // 100
        // page =1 , limit = 10
        //  id = 1 -10  => skip = 0
        // page =2 , limit = 10
        // 10
        // 10 id -11 , id 20  => skip 10
        // page 3 limit =10
        //  id = 21 - 30  => skip = 20
        const pageNum = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);
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
            brand_model_1.default.find(filter).limit(pageLimit).skip(skip).sort({ createdAt: -1 }),
            brand_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            message: "Brands fetched",
            data: brands,
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
        const brand = await brand_model_1.default.findOne({ _id: id });
        if (!brand) {
            throw new error_handler_middleware_1.default("Brand not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        res.status(200).json({
            message: `Brand ${brand._id} fetched`,
            data: brand,
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
        // auth logic
        const { name, description } = req.body;
        const file = req.file;
        if (!name) {
            throw new error_handler_middleware_1.default("Brand name is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!file) {
            throw new error_handler_middleware_1.default("Brand logo is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        const brand = new brand_model_1.default({ name, description });
        // file upload
        if (file) {
            const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, dir);
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
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
//* update
const update = async (req, res, next) => {
    try {
        // auth logic
        // id
        const { id } = req.params;
        // data
        const { name, description } = req.body;
        // file
        const file = req.file;
        // find brand
        const brand = await brand_model_1.default.findOne({ _id: id });
        if (!brand) {
            throw new error_handler_middleware_1.default("Brand not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 400);
        }
        if (name) {
            brand.name = name;
        }
        if (description)
            brand.description = description;
        if (file) {
            await (0, cloudinary_utils_1.deleteFile)(brand.logo.public_id);
            const { path, public_id } = await (0, cloudinary_utils_1.upload)(file);
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
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
//* delete
const remove = async (req, res, next) => {
    // auth logic
    try {
        const { id } = req.params;
        const brand = await brand_model_1.default.findOne({ _id: id });
        if (!brand) {
            throw new error_handler_middleware_1.default("Brand not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        await (0, cloudinary_utils_1.deleteFile)(brand.logo.public_id);
        await brand.deleteOne();
        res.status(200).json({
            message: `Brand ${brand._id} deleted`,
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
