const express = require('express');
const cors = require('cors');

const sequelize = require('./database/index');
const authMiddleware = require('./middlewares/auth');

const User = require('./models/user');
const Product = require('./models/product');
const Address = require('./models/address');
const ProductCategory = require('./models/productCategory');
const EmailConfirmation = require('./models/emailConfirmation');

const APP_ROUTER = require('./routes');

Address.belongsTo(User, { as: 'user' });
Product.belongsTo(User, { as: 'seller' });
Product.belongsTo(ProductCategory, { as: 'productCategory' });
ProductCategory.belongsTo(ProductCategory, { as: 'parent' });
EmailConfirmation.belongsTo(User, { as: 'user' });

sequelize.sync({ force: false });

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);
app.use(authMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(APP_ROUTER);

module.exports = app;
