const bcrypt = require("bcrypt");
const express = require("express");

const userService = require("../services/users");
const emailService = require("../services/email");
const tokenService = require("../services/token");
const ServerError = require("../exception/serverError");

/**
 * Given refreshToken, generates new token pair
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function refreshAccessToken(req, res, next) {
  try {
    const { refreshToken: refreshTokenFromPayload } = req.body;
    const { accessToken, refreshToken } = await tokenService.refreshAccessToken(
      refreshTokenFromPayload
    );
    res.send({
      error: null,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * This controller confirms users email and updates user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function emailConfirmation(req, res, next) {
  try {
    const { confirmationToken } = req.params;
    const emailConfirmation = await emailService.findActiveConfirmation(
      confirmationToken
    );

    if (!emailConfirmation) {
      return next(
        new ServerError("The confirmation link does not exist or expired!", 403)
      );
    }

    await userService.confirmEmailById(emailConfirmation.userId);

    res.send({
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logs user in and provides token pairs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return next(new ServerError("Email or password is incorrect!", 401));
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return next(new ServerError("Email or password is incorrect!", 401));
    }

    const { accessToken, refreshToken } = tokenService.generateTokenPair(user);

    res.send({
      error: null,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Registers users and sends confirmation email
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function registration(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return next(new ServerError("User with this email already exists!", 400));
    }

    const user = await userService.createUser(email, fullName, password);
    emailService.sendConfirmationEmail(user);

    res.status(201).send({
      error: null,
      user: {
        id: user.id,
        fullName,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  registration,
  emailConfirmation,
  refreshAccessToken,
};
