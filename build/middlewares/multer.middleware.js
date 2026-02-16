"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_handler_middleware_1 = __importDefault(require("./error_handler.middleware"));
const enum_types_1 = require("../types/enum.types");
const uploader = () => {
    const upload_dir = "uploads/";
    //! max file size
    const max_file_size = 5 * 1024 * 1024; // 5MB
    //? allowed extentions
    const allowed_ext = ["jpg", "jpeg", "webp", "svg", "png"];
    //? check upload dir exists or not
    if (!fs_1.default.existsSync(upload_dir)) {
        fs_1.default.mkdirSync(upload_dir, { recursive: true });
    }
    const myStorage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, upload_dir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        },
    });
    //? file filter
    const fileFilter = (req, file, cb) => {
        const file_ext = path_1.default
            .extname(file.originalname)
            .replace(".", "")
            .toLowerCase();
        const is_allowed = allowed_ext.includes(file_ext);
        if (is_allowed) {
            cb(null, true);
        }
        else {
            cb(new error_handler_middleware_1.default(`Invalid file type.Only ${allowed_ext.join(",")} are allowed`, enum_types_1.ERROR_CODES.VALIDATION_ERR, 400));
        }
    };
    //! upload instance
    const upload = (0, multer_1.default)({
        storage: myStorage,
        fileFilter: fileFilter,
        limits: {
            fileSize: max_file_size,
        },
    });
    return upload;
};
exports.uploader = uploader;
