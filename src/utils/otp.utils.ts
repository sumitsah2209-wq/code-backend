import crypto from 'crypto'

export const createOtp = (length = 6) => {
  console.log("createOtp called");
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(10);
  }

  return otp;
};
