"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getAll = async (req, res) => {
    try {
        // db query -> user collection
        const users = await user_model_1.default.find({});
        //! success response
        res.status(201).json({
            message: "User fetched",
            code: "SUCCESS",
            status: "success",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error?.message || "Internal server error",
            code: "INTERNAL_SERVER_ERR",
            status: "error",
            data: null,
        });
    }
};
exports.getAll = getAll;
//! get by id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_model_1.default.findOne({ _id: id });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                code: "NOT_FOUND_ERR",
                status: "fail",
                data: null,
            });
        }
        res.status(201).json({
            message: "User fetched",
            code: "SUCCESS",
            status: "success",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error?.message || "Internal server error",
            code: "INTERNAL_SERVER_ERR",
            status: "error",
            data: null,
        });
    }
};
exports.getById = getById;
//update
// delete
//
