const express = require('express');
const {
  login,
  registration,
  emailConfirmation,
  refreshAccessToken,
} = require('../controllers/auth');

const router = express.Router();

router.post('/login', login);
router.post('/registration', registration);
router.get('/email-confirmation/:confirmationToken', emailConfirmation);
router.post('/token', refreshAccessToken);

module.exports = router;
