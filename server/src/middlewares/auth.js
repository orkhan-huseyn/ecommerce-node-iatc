const express = require('express');
const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function authMiddleware(req, res, next) {
  if (req.url.startsWith('/auth')) {
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
    req.user = payload;
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }

  next();
}

module.exports = authMiddleware;
