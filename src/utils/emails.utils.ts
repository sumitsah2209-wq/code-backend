// generate account verification otp email html
const otpVerificationHtml = (
  user: { first_name: string; last_name: string; email: string },
  otp: string
) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Account</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#eff6ff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:8px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:20px;text-align:center;">
              <h2 style="margin:0;color:#ffffff;">Account Verification</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px;color:#1f2937;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 12px 0;">
                Hi ${user.first_name},
              </p>
              <p style="margin:0;">
                Please use the verification code below to confirm your email
                address. This code is valid for a limited time.
              </p>
            </td>
          </tr>

          <!-- OTP -->
          <tr>
            <td align="center" style="padding:8px 24px 24px 24px;">
              <div style="
                display:inline-block;
                padding:14px 28px;
                font-size:24px;
                letter-spacing:4px;
                font-weight:bold;
                color:#2563eb;
                background:#eff6ff;
                border:1px dashed #2563eb;
                border-radius:6px;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 24px 16px 24px;color:#6b7280;font-size:13px;line-height:1.6;">
              <p style="margin:0;">
                If you didn’t request this verification, you can safely ignore
                this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  return html;
};

export default otpVerificationHtml;
