"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("../config/env.config");
const smtp_config_1 = __importDefault(require("../config/smtp.config"));
// send email
const sendEmail = async ({ html, subject, to, attachments, bcc, cc, }) => {
    try {
        const mailOptions = {
            from: `Ecom <${env_config_1.ENV_CONFIG.smtp_user}>`,
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
        await smtp_config_1.default.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = sendEmail;
