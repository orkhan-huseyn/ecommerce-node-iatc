const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');

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

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  generateTokenPair,
};
