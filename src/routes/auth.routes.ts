import express from "express";
import {
  login,
  register,
  resendOtp,
  verifyOtp,
} from "../controllers/auth.controller";
import { uploader } from "../middlewares/multer.middleware";

const router = express.Router();

//! multer uploader
const upload = uploader();
//* register user
//? post , /api/auth/register

router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", login);

//* verify otp
router.post("/verify-otp", verifyOtp);

//* resend otp
router.post("/resend-otp", resendOtp);


//* get user detail

export default router;
