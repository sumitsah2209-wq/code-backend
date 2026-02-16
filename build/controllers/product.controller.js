"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNewArrivals = exports.getAllFeatured = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const category_model_1 = __importDefault(require("../models/category.model"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
// https://domain.com/products?query=xyz&page=1&perPage=10
const dir = "/products";
//! get all
const getAll = async (req, res, next) => {
    try {
        // filter & pagination
        const { query, page = "1", limit = "10", category, brand, minPrice, maxPrice, sortField = "createdAt:desc", } = req.query;
        const filter = {};
        const pageNum = parseInt(page);
        const pageLimit = parseInt(limit);
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
                filter.price.$lte = parseInt(maxPrice, 10);
            }
            if (minPrice) {
                filter.price.$gte = parseInt(minPrice, 10);
            }
        }
        // sort obj
        const [field, order] = String(sortField).split(":"); // [createdAt,desc]
        const sortObj = {
            [field]: order === "asc" ? 1 : -1,
        };
        const [products, totalCount] = await Promise.all([
            product_model_1.default.find(filter)
                .populate("category")
                .populate("brand")
                .limit(pageLimit)
                .skip(skip)
                .sort(sortObj),
            product_model_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            message: "Products fetched",
            data: products,
            pagination: (0, pagination_utils_1.paginationMetadata)(pageNum, pageLimit, totalCount),
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
//!  get by id
const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await product_model_1.default.findOne({ _id: id })
            .populate({ path: "category", select: "name image _id " })
            .populate("brand");
        if (!product) {
            throw new error_handler_middleware_1.default("Product not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        res.status(200).json({
            message: `Product ${product._id} fetched`,
            data: product,
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
//! create
const create = async (req, res, next) => {
    try {
        const { name, description, category, brand, price, stock, is_featured, new_arrival, } = req.body;
        // images
        const { cover_image, images } = req.files;
        if (!cover_image) {
            throw new error_handler_middleware_1.default("cover_image is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!category) {
            throw new error_handler_middleware_1.default("Category is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        if (!brand) {
            throw new error_handler_middleware_1.default("Brand is required", enum_types_1.ERROR_CODES.VALIDATION_ERR, 400);
        }
        const product = new product_model_1.default({
            name,
            description,
            price,
            stock,
            is_featured,
            new_arrival,
        });
        //
        const product_category = await category_model_1.default.findOne({ _id: category });
        if (!product_category) {
            throw new error_handler_middleware_1.default("Category not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        const product_brand = await brand_model_1.default.findOne({ _id: brand });
        if (!product_brand) {
            throw new error_handler_middleware_1.default("Brand not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        product.category = product_category._id;
        product.brand = product_brand._id;
        //! cover
        // upload
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], dir);
        product.cover_image = {
            path: path,
            public_id: public_id,
        };
        //! images
        if (images && images.length > 0) {
            const promises = images.map(async (img) => await (0, cloudinary_utils_1.upload)(img, dir));
            const uploadedImages = await Promise.all(promises);
            product.images = uploadedImages;
        }
        //! save product
        await product.save();
        res.status(201).json({
            message: `Product ${product._id} created`,
            data: product,
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
// update
const update = async (req, res, next) => {
    try {
        // id
        const { id } = req.params;
        // data
        const { name, description, category, brand, price, stock, is_featured, new_arrival, } = req.body;
        // images
        const { cover_image, images } = req.files;
        const product = await product_model_1.default.findOne({ _id: id });
        if (!product) {
            throw new error_handler_middleware_1.default("Product not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        if (name)
            product.name = name;
        if (description)
            product.description = description;
        if (price)
            product.price = price;
        if (stock)
            product.stock = stock;
        if (is_featured)
            product.is_featured = is_featured;
        if (new_arrival)
            product.new_arrival = new_arrival;
        if (category && category.toString() !== product.category.toString()) {
            const newCategory = await category_model_1.default.findOne({ _id: category });
            if (!newCategory) {
                throw new error_handler_middleware_1.default("Category not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
            }
            product.category = newCategory._id;
        }
        if (brand && brand.toString() !== product.brand.toString()) {
            const newBrand = await brand_model_1.default.findOne({ _id: brand });
            if (!newBrand) {
                throw new error_handler_middleware_1.default("Brand not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
            }
            product.brand = newBrand._id;
        }
        if (cover_image && cover_image[0]) {
            const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], dir);
            await (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
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
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
// delete
const remove = async (req, res, next) => {
    try {
        const { id } = req.params; // product id
        const product = await product_model_1.default.findOne({ _id: id });
        const imagesToDelete = [];
        if (!product) {
            throw new error_handler_middleware_1.default("Product not found", enum_types_1.ERROR_CODES.NOT_FOUND_ERR, 404);
        }
        imagesToDelete.push(product.cover_image.public_id);
        if (product.images && product.images.length > 0) {
            product.images.forEach((img) => {
                if (img?.public_id) {
                    imagesToDelete.push(img?.public_id);
                }
            });
        }
        const promises = imagesToDelete.map(async (id) => await (0, cloudinary_utils_1.deleteFile)(id));
        await Promise.all(promises);
        // await Promise.all(imagesToDelete.map(async (id) => await deleteFile(id)));
        await product.deleteOne();
        res.status(200).json({
            message: `Product ${id} deleted`,
            status: "success",
            code: "SUCCESS",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
// get all featured
const getAllFeatured = async (req, res, next) => {
    try {
        const products = await product_model_1.default.find({ is_featured: true });
        res.status(200).json({
            message: "featured products fetched",
            data: products,
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllFeatured = getAllFeatured;
// get all new arrivals
const getAllNewArrivals = async (req, res, next) => {
    try {
        const products = await product_model_1.default.find({ new_arrival: true });
        res.status(200).json({
            message: "new arrival products fetched",
            data: products,
            status: "success",
            code: "SUCCESS",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllNewArrivals = getAllNewArrivals;
