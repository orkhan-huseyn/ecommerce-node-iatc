const express = require('express');
const {
  login,
  registration,
  emailConfirmation,
} = require('../controllers/auth');

const router = express.Router();

router.post('/login', login);
router.post('/registration', registration);
router.get('/email-confirmation/:confirmationToken', emailConfirmation);

module.exports = router;
