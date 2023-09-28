const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUNDS = 10;

/**
 * Returns a user with given email
 * @param {string} email
 */
async function getUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

/**
 * Creates new user with hashed password
 * @param {string} email
 * @param {string} fullName
 * @param {string} password
 */
async function createUser(email, fullName, password) {
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });
  return user;
}

/**
 * Updates emailConfirmed to true by user's id
 * @param {string} userId
 */
async function confirmEmailById(userId) {
  await User.update(
    {
      emailConfirmed: true,
    },
    {
      where: {
        id: userId,
      },
    }
  );
}

module.exports = {
  getUserByEmail,
  confirmEmailById,
  createUser,
};
