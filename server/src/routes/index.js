const express = require("express");
const authRouter = require("./auth");
const productsRouter = require("./products");
const usersRouter = require("./users");

const V1_ROUTER = express.Router();

V1_ROUTER.use("/auth", authRouter);
V1_ROUTER.use("/products", productsRouter);
V1_ROUTER.use("/users", usersRouter);

module.exports = {
  V1_ROUTER,
};
