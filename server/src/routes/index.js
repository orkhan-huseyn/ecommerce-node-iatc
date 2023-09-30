const express = require('express');
const authRouter = require('./auth');
const productsRouter = require('./products');
const usersRouter = require('./users');

const APP_ROUTER = express.Router();

APP_ROUTER.use('/auth', authRouter);
APP_ROUTER.use('/products', productsRouter);
APP_ROUTER.use('/users', usersRouter);

module.exports = APP_ROUTER;
