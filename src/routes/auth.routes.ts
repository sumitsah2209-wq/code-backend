//! routing for auth
import express from "express";
import { login, register } from "../controllers/auth.controller";
import multer from "multer";
import { uploader } from "../middlewares/multer.middleware";

//! multer uploader
const router = express.Router();
const upload = uploader();
//* register
router.post("/register", upload.single("profile_image"), register);

//* Login
router.post("/login", login);
export default router;
