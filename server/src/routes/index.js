const express = require('express');
const authRouter = require('./auth');

const APP_ROUTER = express.Router();

APP_ROUTER.use('/auth', authRouter);

module.exports = APP_ROUTER;
