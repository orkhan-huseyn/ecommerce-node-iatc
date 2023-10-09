const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const EmailConfirmation = require("../models/emailConfirmation");
const logger = require("../lib/winston");

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send confirmation email to given user
 * @param {sequelize.Model} user
 */
async function sendConfirmationEmail(user) {
  const emailTemplate = fs
    .readFileSync(path.resolve("src", "email-templates", "confirmation.html"))
    .toString();

  const expiresAt = moment().add(1, "hour").toDate();
  const confirmationToken = crypto.randomBytes(64).toString("base64url");
  const confirmationURL = `http://localhost:8080/auth/email-confirmation/${confirmationToken}`;

  await EmailConfirmation.create({
    userId: user.id,
    expiresAt,
    confirmationToken,
  });

  await transport.sendMail({
    from: "E-Commerce IATC <info@e-commerce-iatc>",
    to: user.email,
    subject: "Confirm your email",
    html: emailTemplate
      .replace("{confirmationURL}", confirmationURL)
      .replace("{fullName}", user.fullName),
  });

  logger.info("Confirmation sent successfully to " + user.email);
}

/**
 * Returns active confirmation entity
 * @param {string} confirmationToken
 */
async function findActiveConfirmation(confirmationToken) {
  const emailConfirmation = await EmailConfirmation.findOne({
    where: {
      confirmationToken,
      expiresAt: {
        [Op.gt]: sequelize.literal("NOW()"),
      },
    },
  });

  return emailConfirmation;
}

module.exports = {
  sendConfirmationEmail,
  findActiveConfirmation,
};
