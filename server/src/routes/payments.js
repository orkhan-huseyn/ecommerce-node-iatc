const express = require("express");
const { createCheckoutSession } = require("../controllers/payments");

const router = express.Router();

router.post("/checkout", createCheckoutSession);

module.exports = router;
