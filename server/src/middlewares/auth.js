const express = require("express");
const jwt = require("jsonwebtoken");
const redisClient = require("../lib/redis");

/**
 * Authentication middleware
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function authMiddleware(req, res, next) {
  if (req.url.startsWith("/api/v1/auth")) {
    return next();
  }

  const accessToken = req.headers["authorization"];
  if (!accessToken) {
    return res.status(401).send({
      error: "Authorization header is not present!",
    });
  }

  const userInfo = await redisClient.get(accessToken);
  if (!userInfo) {
    return res.status(401).send({
      error: "This session has been terminated, please log in again!",
    });
  }

  try {
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = JSON.parse(userInfo);
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }

  next();
}

module.exports = authMiddleware;
