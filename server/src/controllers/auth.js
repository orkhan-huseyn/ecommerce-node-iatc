const bcrypt = require('bcrypt');
const express = require('express');

const userService = require('../services/users');
const emailService = require('../services/email');
const tokenService = require('../services/token');

/**
 * Given refreshToken, generates new token pair
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
async function refreshAccessToken(req, res) {
  const { refreshToken: refreshTokenFromPayload } = req.body;
  const { accessToken, refreshToken } = await tokenService.refreshAccessToken(
    refreshTokenFromPayload
  );
  res.send({
    error: null,
    accessToken,
    refreshToken,
  });
}

/**
 * This controller confirms users email and updates user
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
async function emailConfirmation(req, res) {
  const { confirmationToken } = req.params;
  const emailConfirmation = await emailService.findActiveConfirmation(
    confirmationToken
  );

  if (!emailConfirmation) {
    return res.send({
      error: 'The confirmation link does not exists or expired!',
    });
  }

  await userService.confirmEmailById(emailConfirmation.userId);

  res.send({
    error: null,
  });
}

/**
 * Logs user in and provides token pairs
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
async function login(req, res) {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

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

  const { accessToken, refreshToken } = tokenService.generateTokenPair(user);

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

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).send({
      error: 'User with this email already exists!',
    });
  }

  const user = await userService.createUser(email, fullName, password);
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
  refreshAccessToken,
};
