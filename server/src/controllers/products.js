const express = require('express');
const Product = require('../models/product');

/**
 * Get list of all products with pagination and search
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getAllProducts(req, res) {
  const products = await Product.findAll();
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
async function createProduct(req, res) {}

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
