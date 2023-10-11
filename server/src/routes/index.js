const express = require("express");
const authRouter = require("./auth");
const productsRouter = require("./products");
const usersRouter = require("./users");
const paymentsRouter = require("./payments");
const ordersRouter = require("./orders");

const V1_ROUTER = express.Router();

V1_ROUTER.use("/auth", authRouter);
V1_ROUTER.use("/products", productsRouter);
V1_ROUTER.use("/users", usersRouter);
V1_ROUTER.use("/payments", paymentsRouter);
V1_ROUTER.use("/orders", ordersRouter);

module.exports = {
  V1_ROUTER,
};
