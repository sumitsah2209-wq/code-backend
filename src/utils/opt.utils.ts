import crypto from "crypto";
import { hashText } from "./bcrypt.utils";
import AppError from "../middlewares/error_handler.middleware";
import { ERROR_CODES } from "../types/enum.types";
import sendEmail from "./nodemailer.utils";
import { otpVerificationHtml } from "./email.utils";

export const createOtp = (length = 6) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(9);
  }
  return otp;
};




export const resend_otp = async (user: any) => {
  try {
    // generate otp
    const otp = createOtp();
    // hash otp
    const otp_hash = await hashText(otp.toString());
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp_hash = otp_hash;
    user.otp_expiry = otp_expiry;

    sendEmail({
      to: user.email as string,
      html: otpVerificationHtml(user, otp),
      subject: "Account Verification",
    });

    await user.save();
  } catch (error: any) {
    throw new AppError(
      error?.message || "Something went wrong",
      ERROR_CODES.INTERNAL_SERVER_ERR,
      500,
    );
  }
};

