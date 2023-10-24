const express = require("express");

const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const sequlize = require("../database/index");
const stripeService = require("../services/stripe");
const Product = require("../models/product");
const { Op } = require("sequelize");

/**
 * Given refreshToken, generates new token pair
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function createOrder(req, res, next) {
  const t = await sequlize.transaction();
  const reqOrderItems = req.body.orderItems;

  try {
    const order = await Order.create(
      {
        userId: req.user.id,
        status: "PLACED",
        paymentDetails: {
          paymentId: "asdf",
        },
      },
      { transaction: t }
    );

    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: reqOrderItems.map((item) => item.productId),
        },
      },
    });

    await OrderItem.bulkCreate(
      products.map((product) => {
        const item = reqOrderItems.find(
          (item) => item.productId === product.id
        );
        return {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
        };
      }),
      { transaction: t }
    );

    const amount = products
      .map((product) => {
        const item = reqOrderItems.find(
          (item) => item.productId === product.id
        );
        return {
          price: product.price,
          quantity: item.quantity,
        };
      })
      .reduce((acc, curr) => {
        return curr.price * curr.quantity + acc;
      }, 0);

    const intent = await stripeService.createPaymentIntent(order.id, amount * 100);

    res.status(201).send(intent);

    t.commit();
  } catch (error) {
    t.rollback();
    next(error);
  }
}

module.exports = {
  createOrder,
};

// another example
