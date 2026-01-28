import multer from "multer";
import fs from "fs";
import path from "path";
import AppError from "./error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";
import { Request } from "express";

export const uploader = () => {
  const upload_dir = "uploads/";

  //! max file size
  const max_file_size = 5 * 1024 * 1024; // 5MB

  //? allowed extensions
  const allowed_ext = ["jpg", "jpeg", "webp", "svg", "png"];

  //! check upload dir exists or not
  if (!fs.existsSync(upload_dir)) {
    fs.mkdirSync(upload_dir, { recursive: true });
  }

  const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, upload_dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  //? file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const file_ext = path
      .extname(file.originalname)
      .replace(".", "")
      .toLowerCase();
    console.log(file_ext);

    const is_allowed = allowed_ext.includes(file_ext);

    if (is_allowed) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          `Invalid File Type only ${allowed_ext.join} are allowed`,
          ERROR_CODES.VALIDATION_ERR,
          400,
        ),
      );
    }
  };

  //! upload instance
  const upload = multer({
    storage: myStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: max_file_size,
    },
  });
  return upload;
};
