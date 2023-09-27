const express = require('express');
const jwt = require('jsonwebtoken');

const IGNORED_ROUTES = [
  '/auth/login',
  '/auth/registration',
  '/auth/email-confirmation',
  '/auth/token',
];

/**
 * Authentication middleware
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function authMiddleware(req, res, next) {
  if (IGNORED_ROUTES.includes(req.url)) {
    return next();
  }

  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(401).send({
      error: 'Authorization header is not present!',
    });
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    if (payload.exp > Date.now()) {
      return res.status(401).send({
        error: 'Access token expired!',
      });
    }

    req.user = payload;
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }

  next();
}

module.exports = authMiddleware;
