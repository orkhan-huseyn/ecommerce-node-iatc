const express = require('express');
const sequelize = require('./database/index');
const User = require('./models/user');
const Product = require('./models/product');
const Address = require('./models/address');
const ProductCategory = require('./models/productCategory');
const APP_ROUTER = require('./routes');

Address.belongsTo(User, { as: 'user' });
Product.belongsTo(User, { as: 'seller' });
Product.belongsTo(ProductCategory, { as: 'productCategory' });
ProductCategory.belongsTo(ProductCategory, { as: 'parent' });

sequelize.sync();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(APP_ROUTER);

module.exports = app;
