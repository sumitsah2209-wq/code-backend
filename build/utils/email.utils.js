"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpVerificationHtml = void 0;
// generate account verificatin otp email html
const otpVerificationHtml = (user, otp) => {
    const html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f9fc;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1E90FF;
          font-size: 32px;
          margin: 0;
        }
        .content {
          font-size: 16px;
          line-height: 1.5;
          color: #555;
          margin-bottom: 20px;
        }
        .otp-box {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          padding: 15px;
          background-color: #e0f4ff;
          color: #1E90FF;
          border-radius: 8px;
          margin-bottom: 20px;
          letter-spacing:3px;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #777;
          padding-top: 20px;
        }
        .footer a {
          color: #1E90FF;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Account Verification</h1>
        </div>
        <div class="content">
          <p>Hi ${user.first_name} ${user.last_name},</p>
          <p>Thank you for registering with us. To complete your account setup, please use the following One-Time Password (OTP) for verification:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for the next 10 minutes.</p>
        </div>
        <div class="footer">
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Thank you for choosing our service!</p>
        </div>
      </div>
    </body>
  </html>
  `;
    return html;
};
exports.otpVerificationHtml = otpVerificationHtml;
