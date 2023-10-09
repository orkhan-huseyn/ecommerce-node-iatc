const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");

const userService = require("./users");
const redisClient = require("../lib/redis");

/**
 * Generates access token and refresh token pairs
 * @param {Model} user
 */
async function generateTokenPair(user) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30 days",
    }
  );

  const userInfo = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    emailConfirmed: user.emailConfirmed,
    image: user.image,
    refreshToken,
    accessToken,
  };

  await redisClient.set(accessToken, JSON.stringify(userInfo));

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Verifies refresh token and generates new token pair
 * @param {string} accessToken
 * @param {string} refreshToken
 */
async function refreshAccessToken(accessToken, refreshToken) {
  const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
  const userInfo = await redisClient.get(accessToken);
  if (!userInfo) {
    throw new ServerError(
      "The session has been terminated. Please log in again.",
      401
    );
  }

  await redisClient.hDel(accessToken);
  const user = await userService.getUserById(userId);
  return generateTokenPair(user);
}

/**
 * Iinvalidates accessToken by removing it from redis
 * @param {string} accessToken
 */
async function invalidateToken(accessToken) {
  await redisClient.del(accessToken);
}

module.exports = {
  generateTokenPair,
  refreshAccessToken,
  invalidateToken,
};
