import { ENV_CONFIG } from "../config/env.config";
import tranporter from "../config/smtp.config";

interface IMainOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}

// send email
const sendEmail = async ({
  html,
  subject,
  to,
  attachments,
  bcc,
  cc,
}: IMainOptions) => {
  try {
    const mailOptions: any = {
      from: `Ecom <${ENV_CONFIG.smtp_user}>`,
      to: to,
      subject: subject,
      html: html,
    };

    if (cc) {
      mailOptions["cc"] = cc;
    }

    if (bcc) {
      mailOptions["bcc"] = bcc;
    }

    if (attachments) {
      mailOptions["attachments"] = attachments;
    }

    //send email
    await tranporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
