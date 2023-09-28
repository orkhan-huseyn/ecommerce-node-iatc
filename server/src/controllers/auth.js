const bcrypt = require('bcrypt');
const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const emailService = require('../services/email');

const User = require('../models/user');
const EmailConfirmation = require('../models/emailConfirmation');

const SALT_ROUNDS = 10;

/**
 * This controller confirms users email and updates user
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
async function emailConfirmation(req, res) {
  const { confirmationToken } = req.params;
  const emailConfirmation = await EmailConfirmation.findOne({
    where: {
      confirmationToken,
      expiresAt: {
        [Op.lt]: moment().toDate(), // TODO: fix timezone problem
      },
    },
  });

  if (!emailConfirmation) {
    return res.send({
      error: 'The confirmation link does not exists or expired!',
    });
  }

  await User.update(
    {
      emailConfirmed: true,
    },
    {
      where: {
        id: emailConfirmation.userId,
      },
    }
  );

  res.send({
    error: null,
  });
}

/**
 * Logs user in and provides access token
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(401).send({
      error: 'Email or password is incorrect!',
    });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({
      error: 'Email or password is incorrect!',
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30m',
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30 days',
    }
  );

  res.send({
    error: null,
    accessToken,
    refreshToken,
  });
}

/**
 * Registers users and sends confirmation email
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
async function registration(req, res) {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).send({
      error: 'User with this email already exists!',
    });
  }

  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  emailService.sendConfirmationEmail(user);

  return res.status(201).send({
    error: null,
    user: {
      id: user.id,
      fullName,
      email,
    },
  });
}

module.exports = {
  login,
  registration,
  emailConfirmation,
};
