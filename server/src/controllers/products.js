const express = require('express');
const sequelize = require('../database/index');
const Product = require('../models/product');
const ProductImage = require('../models/productImage');

/**
 * Get list of all products with pagination and search
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getAllProducts(req, res) {
  const products = await Product.findAll({
    attributes: [
      'id',
      'title',
      'description',
      'price',
      'stockCount',
      'condition',
      'rating',
    ],
    include: {
      model: ProductImage,
    },
  });

  res.send({
    error: null,
    products,
  });
}

/**
 * Create new product
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function createProduct(req, res, next) {
  if (!req.user.emailConfirmed) {
    return next(
      new Error('You cannot create new product without confirming your email!')
    );
  }

  const { title, description, price, stockCount, condition } = req.body;
  const t = await sequelize.transaction();

  const product = await Product.create(
    {
      title,
      description,
      price,
      stockCount,
      condition,
    },
    {
      transaction: t,
    }
  );

  const productImages = req.files.map(function (file) {
    return {
      url: file.path.replace('src/', ''),
      productId: product.id,
    };
  });

  await ProductImage.bulkCreate(productImages, {
    transaction: t,
  });

  t.commit();

  res.status(201).send();
}

/**
 * Update a product with id
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function updateProduct(req, res) {}

/**
 * Delete product with id
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function deleteProduct(req, res) {}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
