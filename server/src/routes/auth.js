const express = require('express');
const { login, registration } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/registration', registration);

module.exports = authRouter;
