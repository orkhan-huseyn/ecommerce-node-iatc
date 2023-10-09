const express = require("express");
const {
  login,
  logout,
  registration,
  emailConfirmation,
  refreshAccessToken,
} = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/registration", registration);
router.get("/email-confirmation/:confirmationToken", emailConfirmation);
router.post("/token", refreshAccessToken);

module.exports = router;
