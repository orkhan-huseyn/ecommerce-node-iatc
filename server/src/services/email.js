const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const moment = require('moment');

const EmailConfirmation = require('../models/emailConfirmation');

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendConfirmationEmail(user) {
  const emailTemplate = fs
    .readFileSync(path.resolve('src', 'email-templates', 'confirmation.html'))
    .toString();

  const expiresAt = moment().add(1, 'hour').toDate();

  const confirmationToken = crypto.randomBytes(64).toString('base64url');
  const confirmationURL = `http://localhost:8080/auth/email-confirmation/${confirmationToken}`;

  await EmailConfirmation.create({
    userId: user.id,
    expiresAt,
    confirmationToken,
  });

  transport.sendMail({
    from: 'E-Commerce IATC <info@e-commerce-iatc>',
    to: user.email,
    subject: 'Confirm your email',
    html: emailTemplate
      .replace('{confirmationURL}', confirmationURL)
      .replace('{fullName}', user.fullName),
  });
}

module.exports = {
  sendConfirmationEmail,
};
