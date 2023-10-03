const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');

const userService = require('./users');

/**
 * Generates access token and refresh token pairs
 * @param {Model} user
 */
function generateTokenPair(user) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      emailConfirmed: user.emailConfirmed,
      image: user.image,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '5m',
    }
  );

  // TODO: how to invalidate refresh token?
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30 days',
    }
  );

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Verifies refresh token and generates new token pair
 * @param {string} refreshToken
 */
async function refreshAccessToken(refreshToken) {
  const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
  const user = await userService.getUserById(userId);
  return generateTokenPair(user);
}

module.exports = {
  generateTokenPair,
  refreshAccessToken,
};
