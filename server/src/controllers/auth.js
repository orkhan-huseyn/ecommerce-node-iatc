const bcrypt = require("bcrypt");
const express = require("express");

const userService = require("../services/users");
const emailService = require("../services/email");
const tokenService = require("../services/token");
const ServerError = require("../exception/serverError");
const logger = require("../lib/winston");

/**
 * Given refreshToken, generates new token pair
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function refreshAccessToken(req, res, next) {
  try {
    const {
      accessToken: accessTokenFromPayload,
      refreshToken: refreshTokenFromPayload,
    } = req.body;
    const { accessToken, refreshToken } = await tokenService.refreshAccessToken(
      accessTokenFromPayload,
      refreshTokenFromPayload
    );
    logger.info(
      "Token " + accessToken + " was refreshed by " + refreshTokenFromPayload
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
    logger.info("User " + user.id + "  confirmed his/her email successfully");

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

    const { accessToken, refreshToken } = await tokenService.generateTokenPair(user);
    logger.info("User " + user.id + " logged in successfully.");

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
    logger.info("User created successfully", user.id);
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

/**
 * Logs user out and invalidates token pairs
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function logout(req, res, next) {
  try {
    await tokenService.invalidateToken(req.user.accessToken);
    res.send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  logout,
  registration,
  emailConfirmation,
  refreshAccessToken,
};
