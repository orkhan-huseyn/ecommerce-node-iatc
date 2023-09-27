const express = require('express');
const authRouter = require('./auth');
const productsRouter = require('./products');

const APP_ROUTER = express.Router();

APP_ROUTER.use('/auth', authRouter);
APP_ROUTER.use('/products', productsRouter);

module.exports = APP_ROUTER;
