const path = require('path');
const express = require('express');
const cors = require('cors');
const xssClean = require('xss-clean');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const RedisClient = require('ioredis');

const sequelize = require('./database/index');
const authMiddleware = require('./middlewares/auth');

const User = require('./models/user');
const Product = require('./models/product');
const Address = require('./models/address');
const ProductCategory = require('./models/productCategory');
const ProductImage = require('./models/productImage');
const EmailConfirmation = require('./models/emailConfirmation');

const APP_ROUTER = require('./routes');

Address.belongsTo(User, { as: 'user' });
Product.belongsTo(User, { as: 'seller' });
Product.belongsTo(ProductCategory, { as: 'productCategory' });
ProductCategory.belongsTo(ProductCategory, { as: 'parent' });
Product.hasMany(ProductImage);
ProductImage.belongsTo(Product, { as: 'product' });
EmailConfirmation.belongsTo(User, { as: 'user' });

sequelize.sync({ force: false });

const app = express();

const redisClient = new RedisClient();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

app.use('/public', express.static(path.resolve('src', 'public')));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);
app.use(helmet());
app.use(limiter);
app.use(authMiddleware);
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '10kb' }));
app.use(xssClean());

app.use('/api', APP_ROUTER);

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  } 
}

app.use(function (error, req, res, next) {
  res.status(500).send({ error: error.message });
});

module.exports = app;
