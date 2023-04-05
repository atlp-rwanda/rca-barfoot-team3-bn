const nodemailer = require('nodemailer');

const Transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_HOST_PORT,
  secure: process.env.MAIL_HOST_SECURE,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = Transport;
