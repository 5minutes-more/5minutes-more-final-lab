const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'a.lucia.cazorla@gmail.com',
    pass: process.env.MAIL_PASSWORD
  }
});

module.exports = transporter;