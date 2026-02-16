import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { compareHash, hashText } from "../utils/bcrypt.utils";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";
import { upload } from "../utils/cloudinary.utils";
import { createOtp, resend_otp } from "../utils/opt.utils";
import sendEmail from "../utils/nodemailer.utils";
import { otpVerificationHtml } from "../utils/email.utils";
import { signAccessToken } from "../utils/jwt.utils";
import { ENV_CONFIG } from "../config/env.config";

const dir = "/profile_images";

//! register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;
    const file = req.file;

    if (!first_name) {
      throw new AppError(
        "first_name is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }
    if (!last_name) {
      throw new AppError(
        "last_name is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }
    if (!email) {
      throw new AppError("email is required", ERROR_CODES.VALIDATION_ERR, 400);
    }
    if (!password) {
      throw new AppError(
        "password is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    // create user
    // const user = await User.create({})
    const user = new User({ first_name, last_name, email, phone });

    // password hash
    const hash_password = await hashText(password);
    user.password = hash_password;

    // profile image
    if (file) {
      //* upload image to cloudinary
      const { path, public_id } = await upload(file, dir);
      //* save image
      user.profile_image = {
        path: path,
        public_id: public_id,
      };
    }
    //! otp

    const otp = createOtp();

    const otp_hash = await hashText(otp);
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp_hash = otp_hash;
    user.otp_expiry = otp_expiry;

    // send opt => email
    sendEmail({
      to: user.email,
      subject: "Verify Account",
      html: otpVerificationHtml(user, otp),
    });
    //! save user
    await user.save();

    //! success response
    res.status(201).json({
      message: "Account created",
      code: "SUCCESS",
      status: "success",
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

//! login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new AppError("email is required", ERROR_CODES.VALIDATION_ERR, 400);
    }
    if (!password) {
      throw new AppError(
        "password is required",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }

    // get user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError(
        "email or password does not match.",
        ERROR_CODES.AUTH_ERR,
        400,
      );
    }

    if (!user.is_verified) {
      throw new AppError("Account is not verified.", ERROR_CODES.AUTH_ERR, 400);
    }

    console.log(user);
    //? compare password
    const is_pass_match = await compareHash(password, user.password);

    if (!is_pass_match) {
      throw new AppError(
        "email or password does not match.",
        ERROR_CODES.AUTH_ERR,
        400,
      );
    }

    // generate jwt token
    const access_token = signAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    //! success response
    res
      .cookie("access_token", access_token, {
        httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
        sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
        secure: ENV_CONFIG.node_env === "development" ? false : true,
        maxAge:
          Number(ENV_CONFIG.cookie_expires_in || "7") * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Login successful!!",
        code: "SUCCESS",
        status: "success",
        data: user,
        access_token,
      });
  } catch (error: any) {
    next(error);
  }
};

// verify-otp
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // otp,email  <= req.body
    // find user by email
    // compare otp
    // opt => doesnot match  => error
    // check opt_expiry
    // if expired => error
    // update user
    // user.opt_hash = undefiend
    // user.otp_expiry = undefined
    // user.is_verified = true
    // await user.save()
    // success res

    const { email, otp } = req.body;

    if (!email) {
      throw new AppError("Email is required", ERROR_CODES.VALIDATION_ERR, 400);
    }
    if (!otp) {
      throw new AppError("OTP is required", ERROR_CODES.VALIDATION_ERR, 400);
    }

    const user = await User.findOne({ email }).select("+otp_hash +otp_expiry");

    if (!user) {
      throw new AppError("User not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }
    if (user.otp_expiry && user.otp_hash) {
      const is_otp_expired = new Date(Date.now()) > user.otp_expiry;

      if (is_otp_expired) {
        throw new AppError(
          "OTP is expired. Try resend otp",
          ERROR_CODES.VALIDATION_ERR,
          400,
        );
      }

      // compare otp
      const is_otp_matched = await compareHash(otp.toString(), user.otp_hash);
      if (!is_otp_matched) {
        throw new AppError(
          "Invalid OTP. Try resend otp",
          ERROR_CODES.VALIDATION_ERR,
          400,
        );
      }

      user.is_verified = true;
      user.otp_hash = undefined;
      user.otp_expiry = undefined;
      await user.save();

      res.status(200).json({
        message: "Account verified",
        code: "SUCCESS",
        status: "success",
        data: null,
      });
    } else {
      throw new AppError(
        "Invalid Otp.Please try resend otp",
        ERROR_CODES.VALIDATION_ERR,
        400,
      );
    }
  } catch (error) {
    next(error);
  }
};

//! resend otp
export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    //! find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", ERROR_CODES.NOT_FOUND_ERR, 404);
    }

    if (user.is_verified) {
      throw new AppError(
        "Account already verified.",
        ERROR_CODES.AUTH_ERR,
        400,
      );
    }

    // resend otp
    await resend_otp(user);

    res.status(201).json({
      message: `Otp sent to email address ${user.email}.`,
      code: "SUCCESS",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

//* get user profile
