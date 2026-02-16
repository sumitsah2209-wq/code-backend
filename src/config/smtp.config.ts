import nodemailer from 'nodemailer'
import { ENV_CONFIG } from './env.config';


const tranporter = nodemailer.createTransport({
    host:ENV_CONFIG.smtp_host,
    service:ENV_CONFIG.smtp_service,
    port:Number(ENV_CONFIG.smtp_port) || 587,
    secure: Number(ENV_CONFIG.smtp_port) === 465 ? true : false,
    auth:{
        user:'sunya.sagarbhandari@gmail.com',
        pass:"yvej fghp hkea wgfm"
    }
})

export default tranporter;