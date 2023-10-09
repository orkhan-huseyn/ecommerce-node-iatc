const path = require("path");
const express = require("express");
const cors = require("cors");
const xssClean = require("xss-clean");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { V1_ROUTER } = require("./routes");

const sequelize = require("./database/index");
const authMiddleware = require("./middlewares/auth");

const User = require("./models/user");
const Product = require("./models/product");
const Address = require("./models/address");
const ProductCategory = require("./models/productCategory");
const ProductImage = require("./models/productImage");
const EmailConfirmation = require("./models/emailConfirmation");
const logger = require("./lib/winston");
const redisClient = require("./lib/redis");

Address.belongsTo(User, { as: "user" });
Product.belongsTo(User, { as: "seller" });
Product.belongsTo(ProductCategory, { as: "productCategory" });
ProductCategory.belongsTo(ProductCategory, { as: "parent" });
Product.hasMany(ProductImage);
ProductImage.belongsTo(Product, { as: "product" });
EmailConfirmation.belongsTo(User, { as: "user" });

sequelize.sync({ force: false });

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

app.use("/public", express.static(path.resolve("src", "public")));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);
app.use(helmet());
app.use(limiter);
app.use(authMiddleware);
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "10kb" }));
app.use(xssClean());

app.use("/api/v1", V1_ROUTER);

app.use(function (error, req, res, next) {
  const statusCode = error.status || 500;
  const message = error.message || "Ooops! Something went wrong.";
  logger.error("Error middleware caught an error", error);
  res.status(statusCode).send({ error: message, stack: error.stack });
});

module.exports = app;
