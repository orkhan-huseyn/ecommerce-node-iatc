const Product = require('../models/product');

async function getAllProducts(req, res) {
  const products = await Product.findAll();
  res.send({
    error: null,
    products,
  });
}

module.exports = {
  getAllProducts,
};
