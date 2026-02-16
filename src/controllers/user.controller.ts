import { Request, Response } from "express";
import User from "../models/user.model";

export const getAll = async (req: Request, res: Response) => {
  try {
    // db query -> user collection
    const users = await User.find({});
    //! success response
    res.status(201).json({
      message: "User fetched",
      code: "SUCCESS",
      status: "success",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      code: "INTERNAL_SERVER_ERR",
      status: "error",
      data: null,
    });
  }
};

//! get by id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

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
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      code: "INTERNAL_SERVER_ERR",
      status: "error",
      data: null,
    });
  }
};

//update

// delete

//
