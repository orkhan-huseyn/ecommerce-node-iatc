const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUNDS = 10;

async function login(req, res) {}

async function registration(req, res) {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).send({
      error: 'User with this email already exists!',
    });
  }

  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  return res.status(201).send({
    error: null,
    user,
  });
}

module.exports = {
  login,
  registration,
};
