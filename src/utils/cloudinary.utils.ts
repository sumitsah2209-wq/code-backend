import cloudinary from "../config/cloudinary.config";
import fs from "fs";

import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";

// upload to cloudinary
export const upload = async (file: Express.Multer.File, dir = "/") => {
  try {
    const upload_dir = "team_8" + dir;

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: upload_dir,
        unique_filename: true,
      },
    );

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      public_id,
      path: secure_url,
    };
  } catch (error) {
    console.log(error);
    throw new AppError(
      "File upload error",
      ERROR_CODES.INTERNAL_SERVER_ERR,
      500,
    );
  }
};

//! delete file from cloud

export const deleteFile = async (public_id: string) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong",
      ERROR_CODES.INTERNAL_SERVER_ERR,
      500,
    );
  }
};
