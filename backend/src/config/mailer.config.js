
const CONFIG = require('./default');
const SENDGRID_MAIL = require('@sendgrid/mail');

SENDGRID_MAIL.setApiKey(CONFIG.SG_API_KEY);

module.exports = SENDGRID_MAIL;
/**
 * Code for sending email through gmail
 */
// var smtpTransport = require('nodemailer-smtp-transport');
// const MAILER = require('nodemailer');

// const TRANSPORTER = MAILER.createTransport(smtpTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     secure: true,
//     auth: {
//         user: CONFIG.gmailCredentials.email,
//         pass: CONFIG.gmailCredentials.password
//     }
// }))

// module.exports = {
//     TRANSPORTER
// }