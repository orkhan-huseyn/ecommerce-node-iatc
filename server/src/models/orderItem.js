const { DataTypes } = require("sequelize");
const sequelize = require("../database/index");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = OrderItem;
