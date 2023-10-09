const express = require("express");
const sequelize = require("../database/index");
const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const ServerError = require("../exception/serverError");

/**
 * Get list of all products with pagination and search
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getAllProducts(req, res) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "stockCount",
        "condition",
        "rating",
      ],
      offset,
      limit,
      include: {
        model: ProductImage,
      },
    });

    res.send({
      error: null,
      products,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new product
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function createProduct(req, res, next) {
  if (!req.user.emailConfirmed) {
    return next(
      new ServerError(
        "You cannot create new product without confirming your email!",
        403
      )
    );
  }

  const { title, description, price, stockCount, condition } = req.body;
  const t = await sequelize.transaction();

  try {
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
        url: file.path.replace("src/", ""),
        productId: product.id,
      };
    });

    await ProductImage.bulkCreate(productImages, {
      transaction: t,
    });

    t.commit();

    res.status(201).send();
  } catch (error) {
    t.rollback();
    next(error);
  }
}

/**
 * Update a product with id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function updateProduct(req, res) {}

/**
 * Delete product with id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function deleteProduct(req, res) {}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
