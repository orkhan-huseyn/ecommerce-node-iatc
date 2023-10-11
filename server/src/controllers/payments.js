const express = require("express");
const { Op } = require("sequelize");

const Product = require("../models/product");
const stripeService = require("../services/stripe");

/**
 * Creates stripe checkout session and returns it
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function createCheckoutSession(req, res, next) {
  try {
    const orderItems = req.body.orderItems;
    // OrderItem[], OrderItem { productId: string; quantity: number;  }

    const products = await Product.findAll({
      where: {
        [Op.in]: orderItems.map((orderItem) => orderItem.productId),
      },
    });

    const lineItems = products.map(function (product) {
      const item = orderItems.find(
        (orderItem) => orderItem.productId === product.id
      );
      return {
        price_data: {
          unit_amount: product.price,
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: [
              "https://static.independent.co.uk/2023/09/19/12/iphone%2015%20pro%20hero%20pic.png?width=1200",
            ],
          },
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripeService.createCheckoutSession(
      lineItems
    );

    // TODO: INSERT INTO Orders
    // TODO: INSERT INTO OrderItems

    res.send(checkoutSession);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCheckoutSession,
};
